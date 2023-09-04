import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEngagementDto } from '../dto/create-post.dto';
import { EngagementType } from '../enums/engagement.enum';
import { BlogRepository } from '../blog.repository';
import { EngagementInterface } from '../interfaces/engagement.interface';

@Injectable()
export class EngagementService {
  constructor(private readonly blogRepository: BlogRepository) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: dedicated service for creating engagement(s) on a blog post
   *
   * @param createEngagementDto
   * @returns {Promise<any>}
   */

  async createEngagement(createEngagementDto: CreateEngagementDto): Promise<any> {
    try {
      const { post_id, flag, comment } = createEngagementDto;

      const _thePost = await this.blogRepository.findBlogPost({ id: +post_id });
      if (!_thePost) throw new HttpException('Post has been deleted', HttpStatus.NOT_FOUND);

      function message() {
        return flag === EngagementType.LIKE
          ? 'Successfully liked post'
          : flag === EngagementType.VIEW
          ? 'Successfully viewed post'
          : 'Successfully commented on post';
      }

      function engagementData(): Partial<EngagementInterface> {
        return {
          type: flag === EngagementType.LIKE ? EngagementType.LIKE : flag === EngagementType.VIEW ? EngagementType.VIEW : EngagementType.COMMENT,
          post_id,
          [flag === EngagementType.LIKE ? 'likedAt' : flag === EngagementType.VIEW ? 'viewedAt' : 'commentedAt']: new Date(Date.now()),
          comment: flag === EngagementType.COMMENT ? comment : null,
        };
      }
      const __promise: any = [];

      __promise.push(this.blogRepository.createEngagement(engagementData()));
      flag === EngagementType.LIKE
        ? __promise.push(this.blogRepository.incOrDecLikesViewsAndComments(post_id, EngagementType.LIKE, 'add'))
        : flag === EngagementType.VIEW
        ? __promise.push(this.blogRepository.incOrDecLikesViewsAndComments(post_id, EngagementType.VIEW))
        : __promise.push(this.blogRepository.incOrDecLikesViewsAndComments(post_id, EngagementType.COMMENT, 'add'));

      await Promise.all(__promise);
      return { message: message(), data: {} };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }
}
