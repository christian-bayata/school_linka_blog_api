import { Inject, Injectable } from '@nestjs/common';
import { Blog } from 'src/schema/blog.schema';
import { BLOG_REPOSITORY, ENGAGEMENT_REPOSITORY } from '../common/constant';
import { PropDataInput } from '../common/interface';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { AdditionalQuery } from './interfaces/query.interface';
import { Op } from 'sequelize';
import { Engagement } from '../schema/engagement.schema';
import { EngagementType } from './enums/engagement.enum';

@Injectable()
export class BlogRepository {
  constructor(
    @Inject(BLOG_REPOSITORY) private readonly blog: typeof Blog,
    @Inject(ENGAGEMENT_REPOSITORY) private readonly engagement: typeof Engagement,
  ) {}

  /*****************************************************************************************************************************
   *
   **************************************** POSTS' SECTION **********************************
   *
   ******************************************************************************************************************************
   */

  /**
   * @Responsibility: Repo to retrieve blog details
   *
   * @param where
   * @returns {Promise<Partial<Blog>>}
   */

  async findBlogPost(where: PropDataInput, attributes?: string[]): Promise<Partial<Blog>> {
    return await this.blog.findOne({
      where,
      attributes,
    });
  }

  /**
   * @Responsibility: Repo to create a new blog post
   *
   * @param data
   * @returns {Promise<Partial<Blog>>}
   */

  async createBlogPost(data: any): Promise<Partial<Blog>> {
    return await this.blog.create(data);
  }

  /**
   * @Responsibility: Repo to retrieve all blog posts
   *
   * @param data
   * @returns {Promise<Partial<Blog[]> | any>}
   */

  async findAllPosts(data?: FetchPostsDto): Promise<Partial<Blog[]> | any> {
    const defaultPageAndLimit = { page: 1, limit: 10 };
    const { page, limit, search } = data;

    const query: AdditionalQuery = { order: [['createdAt', 'DESC']] };

    if (search) {
      query.where = { title: { [Op.iLike]: `%${search}%` } };
    }

    let theQuery = { ...query };
    if (page && limit) {
      let thePage = page ? page : defaultPageAndLimit.page;
      theQuery.limit = limit ? +limit : defaultPageAndLimit.limit;
      theQuery.offset = +(thePage - 1) * limit;
    }

    const posts = await this.blog.findAll(theQuery);
    const count = await this.blog.count();

    return { posts, count };
  }

  /**
   * @Responsibility: Repo to update a blog post
   *
   * @param data
   * @returns {Promise<any>}
   */

  async updateBlogPost(data: any, where: any): Promise<any> {
    return await this.blog.update(data, { where });
  }

  /**
   * @Responsibility: Repo to create engagement
   *
   * @param where
   * @returns {Promise<any> }
   */

  async deleteBlogPost(where: PropDataInput): Promise<any> {
    return await this.blog.destroy({ where });
  }

  /*****************************************************************************************************************************
   *
   **************************************** ENGAGEMENT' SECTION **********************************
   *
   ******************************************************************************************************************************
   */

  /**
   * @Responsibility: Repo to retrieve engagement details
   *
   * @param where
   * @returns {Promise<Partial<Engagement>>}
   */

  async findEngagement(where: PropDataInput, attributes?: string[]): Promise<Partial<Engagement>> {
    return await this.engagement.findOne({
      where,
      attributes,
    });
  }

  /**
   * @Responsibility: Repo to create engagement
   *
   * @param data
   * @returns { Promise<Partial<Engagement>>}
   */

  async createEngagement(data: any): Promise<Partial<Engagement>> {
    return await this.engagement.create(data);
  }

  /**
   * @Responsibility: Repo to create engagement
   *
   * @param where
   * @returns {Promise<any> }
   */

  async deleteEngagement(where: PropDataInput): Promise<any> {
    return await this.engagement.destroy({ where });
  }

  /**
   * @Responsibility: Repo to increment likes, views and comments of a post
   *
   * @param post_id
   * @param flag
   * @returns { Promise<Partial<Engagement>>}
   */

  async incLikesViewsAndComments(post_id: number, flag: string): Promise<Partial<Blog> | any> {
    return await this.blog.increment(
      { [flag === EngagementType.LIKE ? 'likesCount' : flag === EngagementType.COMMENT ? 'commentsCount' : 'viewsCount']: 1 },
      { where: { id: +post_id } },
    );
  }

  /**
   * @Responsibility: Repo to decrement likes and comments of a post
   *
   * @param post_id
   * @param flag
   * @returns { Promise<Partial<Engagement>>}
   */

  async decLikesViewsAndComments(post_id: number, flag: string): Promise<Partial<Blog> | any> {
    return await this.blog.decrement({ [flag === EngagementType.UNLIKE ? 'likesCount' : 'commentsCount']: 1 }, { where: { id: +post_id } });
  }
}
