import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEngagementDto, DeleteEngagementDto } from '../dto/create-post.dto';
import { EngagementType } from '../enums/engagement.enum';
import { BlogRepository } from '../blog.repository';
import { EngagementInterface } from '../interfaces/engagement.interface';

@Injectable()
export class EngagementService {
  constructor(private readonly blogRepository: BlogRepository) {}

  private readonly ISE: string = 'Internal Server Error';
  private readonly successfulLikePost: string = 'Successfully liked post';
  private readonly successfulViewPost: string = 'Successfully viewed post';
  private readonly successfulCommentOnPost: string = 'Successfully commented on post';

  private readonly successfulUnlikePost: string = 'Successfully un-liked post';
  private readonly successfulDeleteCommentOnPost: string = 'Successfully deleted comment on post';

  /**
   * @Responsibility: dedicated service for creating engagement(s) on a blog post
   *
   * @param createEngagementDto
   * @returns {Promise<any>}
   */

  async createEngagement(createEngagementDto: CreateEngagementDto): Promise<any> {
    try {
      const { post_id, flag, comment, engager } = createEngagementDto;

      if (![EngagementType.COMMENT, EngagementType.LIKE, EngagementType.VIEW].includes(flag))
        throw new HttpException('Invalid flag', HttpStatus.BAD_REQUEST);

      const _thePost = await this.blogRepository.findBlogPost({ id: +post_id });
      if (!_thePost) throw new HttpException('Post has been deleted', HttpStatus.NOT_FOUND);

      /* The engagement types metrics are: likes, views and comments */
      const message =
        flag === EngagementType.LIKE
          ? this.successfulLikePost
          : flag === EngagementType.VIEW
          ? this.successfulViewPost
          : this.successfulCommentOnPost;

      function engagementData(): Partial<EngagementInterface> {
        return {
          type: flag === EngagementType.LIKE ? EngagementType.LIKE : flag === EngagementType.VIEW ? EngagementType.VIEW : EngagementType.COMMENT,
          post_id,
          [flag === EngagementType.LIKE ? 'likedAt' : flag === EngagementType.VIEW ? 'viewedAt' : 'commentedAt']: new Date(Date.now()),
          comment: flag === EngagementType.COMMENT ? comment : null,
          engager,
        };
      }
      const __promise: any = [];

      __promise.push(this.blogRepository.createEngagement(engagementData()));
      flag === EngagementType.LIKE
        ? __promise.push(this.blogRepository.incLikesViewsAndComments(post_id, EngagementType.LIKE))
        : flag === EngagementType.VIEW
        ? __promise.push(this.blogRepository.incLikesViewsAndComments(post_id, EngagementType.VIEW))
        : __promise.push(this.blogRepository.incLikesViewsAndComments(post_id, EngagementType.COMMENT));

      await Promise.all(__promise);
      return { message, data: {} };
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for deleting engagement(s) on a blog post
   *
   * @param deleteEngagementDto
   * @returns {Promise<any>}
   */

  async deleteEngagement(deleteEngagementDto: DeleteEngagementDto): Promise<any> {
    try {
      const { engager, post_id, flag } = deleteEngagementDto;

      if (![EngagementType.DELETE_COMMENT, EngagementType.UNLIKE].includes(flag)) throw new HttpException('Invalid flag', HttpStatus.BAD_REQUEST);

      const _thePost = await this.blogRepository.findEngagement({
        post_id: +post_id,
        engager,
        type: flag === EngagementType.UNLIKE ? EngagementType.LIKE : EngagementType.COMMENT,
      });
      if (!_thePost) throw new HttpException('Post has been deleted', HttpStatus.NOT_FOUND);

      const message = flag === EngagementType.UNLIKE ? this.successfulUnlikePost : this.successfulDeleteCommentOnPost;

      /* Comments and likes are the only metrics that can be deleted */
      const __promise: any = [];

      /* Delete the engagement and decrement the count on the blog table */
      __promise.push(
        this.blogRepository.deleteEngagement({
          post_id: +post_id,
          engager,
          type: flag === EngagementType.UNLIKE ? EngagementType.LIKE : EngagementType.COMMENT,
        }),
      );
      flag === EngagementType.UNLIKE
        ? __promise.push(this.blogRepository.decLikesViewsAndComments(post_id, EngagementType.UNLIKE))
        : __promise.push(this.blogRepository.decLikesViewsAndComments(post_id, EngagementType.DELETE_COMMENT));

      await Promise.all(__promise);

      return { message, data: {} };
    } catch (error) {}
  }
}
