import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
      .catch((error) => {
        throw error;
      });
  }
}
