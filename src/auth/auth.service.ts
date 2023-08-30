import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as _ from 'lodash';
import { LoginDto } from './dto/login.dto';
import { AuthUtility } from './auth.utility';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly authUtility: AuthUtility,
  ) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: dedicated service for signing up a new user
   *
   * @param createSurveyDto
   * @returns {Promise<any>}
   */

  async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      let { first_name, last_name, email, password } = signUpDto;

      const checkEmail = await this.authUtility.getPlainData(await this.authRepository.findUser({ email }, ['email']));
      if (checkEmail) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

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
      return __user;
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for verifying a new user
   *
   * @param createSurveyDto
   * @returns {Promise<any>}
   */

  async verification(id: string): Promise<any> {
    try {
      const findId = await this.authUtility.getPlainData(await this.authRepository.findUser({ email }, ['email']));
      if (findId) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

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
      return __user;
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for user login
   *
   * @param createSurveyDto
   * @returns {Promise<any>}
   */

  async login(loginDto: LoginDto): Promise<any> {
    try {
      let { email, password } = loginDto;

      const findUser = await this.authUtility.getPlainData(await this.authRepository.findUser({ email }, ['id', 'email', 'password', 'role']));
      if (!findUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      /* validate user password with bcrypt */
      const validPassword = compareSync(password, findUser.password);
      if (!validPassword) throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);

      await this.authRepository.updateUser({ id: findUser.id }, { lastLoggedIn: new Date(Date.now()), loginCount: +1 });

      /* Generate jwt token */
      function jwtPayload() {
        return {
          user_id: findUser.id,
          role: findUser.role,
        };
      }

      const token = this.jwtService.sign(jwtPayload());
      return token;
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /*****************************************************************************************************************************
   *
   ****************************************PRIVATE FUNCTIONS/METHODS **********************************
   *
   ******************************************************************************************************************************
   */
}
