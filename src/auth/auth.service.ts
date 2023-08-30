import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      const { first_name, last_name, email, password } = signUpDto;
    } catch (error) {}
  }
}
