import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('linka-blog')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Req() req: any, @Res() res: Response, @Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}

//   @Get()
//   getAllVendors(@Req() req: RequestWithUser) {
//     return this.userService.getAllVendorStores(req.user);
//   }
