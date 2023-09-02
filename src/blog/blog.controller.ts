import { Body, Controller, HttpException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/guards/jwt/jtw.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/guards/decorators/roles.decorator';

@Controller('linka-blog/post')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/draft')
  @Roles(Role.RWX_USER)
  //@UsePipes(new JoiValidationPipe(signUpSchema))
  async createPost(@Req() req: any, @Res() res: Response, @Body() createPostDto: CreatePostDto): Promise<any> {
    createPostDto.creator = req.user.user_id;
    return await this.blogService
      .createPost(createPostDto)
      .then((resp) => {
        res.status(201).json({ message: 'Successfully drafted blog post', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }
}
