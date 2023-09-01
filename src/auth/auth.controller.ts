import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerificationDto } from './dto/verification.dto';

@Controller('linka-blog')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Req() req: any, @Res() res: Response, @Body() signUpDto: SignUpDto): Promise<any> {
    return await this.authService
      .signUp(signUpDto)
      .then((resp) => {
        res.status(201).json({ message: 'Successfully signed up', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }

  @Post('/login')
  async login(@Req() req: any, @Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
    return await this.authService
      .login(loginDto)
      .then((resp) => {
        res.status(200).json({ message: 'Successfully logged in', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }

  @Post('/verify')
  async verification(@Req() req: any, @Res() res: Response, @Body() verificationDto: VerificationDto): Promise<any> {
    return await this.authService
      .verification(verificationDto)
      .then((resp) => {
        res.status(200).json({ message: 'Successfully verified user', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }
}
