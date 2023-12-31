import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as _ from 'lodash';
import { LoginDto } from './dto/login.dto';
import { AuthUtility } from './auth.utility';
import { JwtService } from '@nestjs/jwt';
import { VerificationDto } from './dto/verification.dto';
import { EmailService } from '../email/email.service';
import { EmailData } from 'src/email/email.interface';
import { verificationText } from '../email/templates/verification-text.template';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { forgotPasswordText } from '../email/templates/forgot-password-text.template';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly authUtility: AuthUtility,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: dedicated service for signing up a new user
   *
   * @param signUpDto
   * @returns {Promise<any>}
   */

  async signUp(signUpDto: SignUpDto, protocol: string): Promise<any> {
    try {
      let { first_name, last_name, email, password } = signUpDto;
      const checkEmail = await this.authRepository.findUser({ email }, ['email']);
      if (checkEmail) throw new HttpException('Email already exists', HttpStatus.CONFLICT);

      /* Hash password before storing it */
      password = hashSync(password, genSaltSync());

      function signupData() {
        return {
          first_name,
          last_name,
          email,
          password,
        };
      }

      const new_user = await this.authRepository.createUser(signupData());
      const __user = _.pick(new_user, ['id', 'first_name', 'last_name', 'email']);

      const __ver_id = uuidv4();
      const verification_link = `${protocol}://${this.configService.get<string>('BASE_URL')}/verify?ver_id=${__ver_id}`;

      /* Send a verification link to user email */
      function emailDispatcher(): EmailData {
        return {
          to: email,
          from: 'Linka <noreply@linka.africa>',
          subject: 'Verify New User',
          text: verificationText(first_name, verification_link),
        };
      }
      // You can uncomment the email sender in your local environment
      // Create an account with mailrap email tester and test out the functionality
      // I've commented it so that it doesnt break the code in the staging environment
      // since I'm only using the test credentials

      /* await this.emailService.emailSender(emailDispatcher()); */

      /* Create a record of the verification */
      function verIdData() {
        return {
          email,
          ver_id: __ver_id,
        };
      }
      await this.authRepository.createVerId(verIdData());

      return { ...__user, ver_id: __ver_id };
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for verifying a new user
   *
   * @param verificationDto
   * @returns {Promise<any>}
   */

  async verification(verificationDto: VerificationDto): Promise<any> {
    try {
      const { email, ver_id } = verificationDto;

      const __user = await this.authRepository.findUser({ email }, ['verified']);
      if (!__user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (__user?.verified) throw new HttpException('User has already been verified', HttpStatus.BAD_REQUEST);

      const findId = await this.authRepository.findAuthorize({ ver_id }, ['email', 'ver_id']);
      if (!findId) throw new HttpException('Invalid verifification id', HttpStatus.BAD_REQUEST);

      function verData() {
        return {
          ver_id,
          email,
        };
      }

      await this.authRepository.verifyUserDeleteVerId(verData());
      return {};
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for user login
   *
   * @param loginDto
   * @returns {Promise<any>}
   */

  async login(loginDto: LoginDto): Promise<any> {
    try {
      let { email, password } = loginDto;

      const theUser = await this.authRepository.findUser({ email }, ['id', 'email', 'password', 'role']);
      if (!theUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      /* validate user password with bcrypt */
      const validPassword = compareSync(password, theUser.password);
      if (!validPassword) throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);

      await this.authRepository.updateUser({ id: theUser.id }, { lastLoggedIn: new Date(Date.now()), loginCount: +1 });

      /* Generate jwt token */
      function jwtPayload() {
        return {
          user_id: theUser?.id,
          role: theUser?.role,
        };
      }

      const token = this.jwtService.sign(jwtPayload());
      return token;
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for forget password
   *
   * @param email
   * @returns {Promise<any>}
   */

  async forgotPassword(email: string): Promise<any> {
    try {
      if (!email) throw new HttpException('Provide the email', HttpStatus.BAD_REQUEST);

      const __user = await this.authRepository.findUser({ email });
      if (!__user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const code = this.authUtility.generateCode();

      /* Send code to user email */
      function emailDispatcher(): EmailData {
        return {
          to: email,
          from: 'Linka <noreply@linka.africa>',
          subject: 'Forgot Password',
          text: forgotPasswordText(code),
        };
      }

      // Please uncomment the email service, create an account with mailtrap email tester
      /* await this.emailService.emailSender(emailDispatcher()); */

      /* Create a record of the password code */
      function forgotPasswordData() {
        return { email, code };
      }

      await this.authRepository.createVerId(forgotPasswordData());
      return forgotPasswordData();
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for reset password
   *
   * @param resetPasswordDto
   * @returns {Promise<any>}
   */

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    try {
      let { password, confirmPassword, email, code } = resetPasswordDto;

      const theCode = await this.authRepository.findAuthorize({ code }, ['code', 'createdAt']);
      if (!theCode) throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);

      /* Delete code if the expiration time is reached */
      let timeCreatedInSec = theCode?.createdAt?.getTime() / 1000;
      let timeNowInSec = new Date().getTime() / 1000;
      let timeDiff = timeNowInSec - timeCreatedInSec;

      // Code expiration time = 30 minutes
      if (timeDiff > 30 * 60) {
        await this.authRepository.deleteAuthorize({ code: theCode?.code });
        throw new HttpException('The verification code has expired', HttpStatus.BAD_REQUEST);
      }

      /* Confirm if passwords match */
      if (password !== confirmPassword) throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

      const __user = await this.authRepository.findUser({ email }, ['id', 'password', 'role']);
      await __user.update({ password: hashSync(password, genSaltSync()) });

      /* Generate another jwt token for user */
      function jwtPayload() {
        return {
          user_id: __user?.id,
          role: __user?.role,
        };
      }
      this.jwtService.sign(jwtPayload());

      return {};
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }
}
