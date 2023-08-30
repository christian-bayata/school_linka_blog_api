import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  private readonly ISE: string = 'Internal Server Error';

  async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      let { first_name, last_name, email, password } = signUpDto;

      const checkEmail = await this.authRepository.findUser({ email }, ['email']);
      if (checkEmail) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

      /* Hash password before stroing it */
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
      throw error;
      //  throw new HttpException(error?.message ? error.message : this.ISE, error?.error?.status);
    }
  }

  /*****************************************************************************************************************************
   *
   ****************************************PRIVATE FUNCTIONS/METHODS **********************************
   *
   ******************************************************************************************************************************
   */
}
