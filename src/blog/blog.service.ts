import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogRepository } from './blog.repository';
import { FetchPostDto } from './dto/fetch-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: dedicated service for creating a blog post
   *
   * @param createPostDto
   * @returns {Promise<any>}
   */

  async createPost(createPostDto: CreatePostDto): Promise<any> {
    try {
      const { title, creator, content } = createPostDto;

      function postData() {
        return { title, creator, status, content };
      }

      return await this.blogRepository.createBlogPost(postData());
    } catch (error) {
      // console.log(error);
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for retrieving a single blog post
   *
   * @param releasePostDto
   * @returns {Promise<any>}
   */

  async fetchSinglePost(fetchPostDto: FetchPostDto): Promise<any> {
    try {
      const { post_id } = fetchPostDto;

      const _thePost = await this.blogRepository.findBlogPost({ id: post_id });
      if (_thePost) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

      return _thePost;
    } catch (error) {
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }
}
