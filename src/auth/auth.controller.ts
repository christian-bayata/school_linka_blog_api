import { Body, Controller, Post, Query, Req, Res, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerificationDto } from './dto/verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('linka-blog')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Req() req: any, @Res() res: Response, @Body() signUpDto: SignUpDto): Promise<any> {
    const protocol = req.protocol;
    return await this.authService
      .signUp(signUpDto, protocol)
      .then((resp) => {
        res.status(201).json({ message: 'Successfully signed up', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
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
  async verification(@Res() res: Response, @Query('ver_id') ver_id: string, @Body('email') email: string): Promise<any> {
    function payload(): VerificationDto {
      return {
        ver_id,
        email,
      };
    }
    return await this.authService
      .verification(payload())
      .then((resp) => {
        res.status(200).json({ message: 'Successfully verified user', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }

  @Post('/forgot-password')
  async forgotPassword(@Res() res: Response, @Body('email') email: string): Promise<any> {
    return await this.authService
      .forgotPassword(email)
      .then((resp) => {
        res.status(200).json({ message: 'Password reset token successfully sent', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }

  @Post('/reset-password')
  async resetPassword(@Res() res: Response, @Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return await this.authService
      .resetPassword(resetPasswordDto)
      .then((resp) => {
        res.status(200).json({ message: 'Password successfully reset', data: resp });
      })
      .catch((error: any) => {
        throw error;
      });
  }
}
