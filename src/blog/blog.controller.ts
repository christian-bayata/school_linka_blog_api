import { Body, Controller, Get, HttpException, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/guards/jwt/jtw.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { FetchPostsDto } from './dto/fetch-posts.dto';

@Controller('linka-blog/post')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/create')
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/single')
  @Roles(Role.RWX_USER, Role.RW_USER, Role.R_user)
  async fetchSinglePost(@Req() req: any, @Res() res: Response, @Query('post_id') post_id: number): Promise<any> {
    return await this.blogService
      .fetchSinglePost(post_id)
      .then((resp) => {
        res.status(201).json({ message: 'Successfully retrieved blog post', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/all')
  @Roles(Role.RWX_USER, Role.RW_USER, Role.R_user)
  async fetchAllPosts(
    @Req() req: any,
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: number,
  ): Promise<any> {
    function payload(): FetchPostsDto {
      return {
        page,
        limit,
        search,
      };
    }
    return await this.blogService
      .fetchAllPosts(payload())
      .then((resp) => {
        res.status(201).json({ message: 'Successfully retrieved posts in batches', data: resp });
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }
}
