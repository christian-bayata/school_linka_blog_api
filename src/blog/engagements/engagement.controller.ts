import { Body, Controller, Delete, HttpException, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../guards/decorators/roles.decorator';
import { JwtAuthGuard } from '../../guards/jwt/jtw.guard';
import { RoleGuard } from '../../guards/roles.guard';
import { CreateEngagementDto, DeleteEngagementDto } from '../dto/create-post.dto';
import { EngagementService } from './engagement.service';
import { Response } from 'express';
import { JoiValidationPipe } from '../../pipes/validation.pipe';
import { createEngagementSchema, deleteEngagementSchema } from '../blog.validation';

@Controller('linka-blog/engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/create')
  @Roles(Role.RWX_USER, Role.RW_USER, Role.R_USER)
  @UsePipes(new JoiValidationPipe(createEngagementSchema))
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/delete')
  @Roles(Role.RWX_USER)
  @UsePipes(new JoiValidationPipe(deleteEngagementSchema))
  async deleteEngagement(@Req() req: any, @Res() res: Response, @Body() deleteEngagementDto: DeleteEngagementDto): Promise<any> {
    deleteEngagementDto.engager = req.user.user_id;
    return await this.engagementService
      .deleteEngagement(deleteEngagementDto)
      .then((resp) => {
        console.log(resp);
        res.status(200).json(resp);
      })
      .catch((e: any) => {
        throw new HttpException(e.message, e.status);
      });
  }
}
