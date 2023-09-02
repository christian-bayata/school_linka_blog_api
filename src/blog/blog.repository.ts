import { Inject, Injectable } from '@nestjs/common';
import { Blog } from 'src/schema/blog.schema';
import { BLOG_REPOSITORY } from 'src/common/constant';
import { PropDataInput } from 'src/common/interface';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { AdditionalQuery } from './query/query.interface';
import { Op } from 'sequelize';

@Injectable()
export class BlogRepository {
  constructor(@Inject(BLOG_REPOSITORY) private readonly blog: typeof Blog) {}

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
}
