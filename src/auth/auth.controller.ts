import { Body, Controller, HttpException, Post, Query, Req, Res, UseFilters, UsePipes } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerificationDto } from './dto/verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import { loginSchema, resetPasswordSchema, signUpSchema } from './auth.validation';

@Controller('linka-blog/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @UsePipes(new JoiValidationPipe(signUpSchema))
  async signUp(@Req() req: any, @Res() res: Response, @Body() signUpDto: SignUpDto): Promise<any> {
    const protocol = req.protocol;
    return await this.authService
      .signUp(signUpDto, protocol)
      .then((resp) => {
        res.status(201).json({ message: 'Successfully signed up', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
    return await this.authService
      .login(loginDto)
      .then((resp) => {
        res.status(200).json({ message: 'Successfully logged in', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
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
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }

  @Post('/forgot-password')
  async forgotPassword(@Res() res: Response, @Body('email') email: string): Promise<any> {
    return await this.authService
      .forgotPassword(email)
      .then((resp) => {
        res.status(200).json({ message: 'Password reset token successfully sent', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }

  @Post('/reset-password')
  @UsePipes(new JoiValidationPipe(resetPasswordSchema))
  async resetPassword(@Res() res: Response, @Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return await this.authService
      .resetPassword(resetPasswordDto)
      .then((resp) => {
        res.status(200).json({ message: 'Password successfully reset', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }
}
