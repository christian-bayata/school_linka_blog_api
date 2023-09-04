import { Body, Controller, HttpException, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt/jtw.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { CreateEngagementDto } from '../dto/create-post.dto';
import { EngagementService } from './engagement.service';
import { Response } from 'express';

@Controller('linka-blog/engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/create')
  @Roles(Role.RWX_USER, Role.RW_USER, Role.R_USER)
  //@UsePipes(new JoiValidationPipe(signUpSchema))
  async createEngagement(@Req() req: any, @Res() res: Response, @Body() createEngagementDto: CreateEngagementDto): Promise<any> {
    createEngagementDto.engager = req.user.user_id;
    return await this.engagementService
      .createEngagement(createEngagementDto)
      .then((resp) => {
        res.status(201).json(resp);
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }

  @UseGuards(RoleGuard)
  @Post('/delete')
  @Roles(Role.RWX_USER, Role.RW_USER, Role.R_USER)
  //@UsePipes(new JoiValidationPipe(signUpSchema))
  async deleteEngagement(@Req() req: any, @Res() res: Response, @Query() post_id: number): Promise<any> {
    return await this.engagementService
      .deleteEngagement(post_id)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }
}
