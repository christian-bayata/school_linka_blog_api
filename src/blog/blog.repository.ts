import { Inject, Injectable } from '@nestjs/common';
import { Blog } from 'src/schema/blog.schema';
import { BLOG_REPOSITORY } from 'src/common/constant';
import { PropDataInput } from 'src/common/interface';

@Injectable()
export class BlogRepository {
  constructor(@Inject(BLOG_REPOSITORY) private readonly blog: typeof Blog) {}

  /**
   * @Responsibility: Repo to retrieve blog details
   *
   * @param where
   * @returns {Promise<Blog>}
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
   * @returns {Promise<Partial<User>>}
   */

  async createBlogPost(data: any): Promise<Partial<Blog>> {
    return await this.blog.create(data);
  }
}
