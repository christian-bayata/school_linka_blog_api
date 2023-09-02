import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogRepository } from './blog.repository';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { EditPostDto } from './dto/edit-post.dto';

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
   * @param post_id
   * @returns {Promise<any>}
   */

  async fetchSinglePost(post_id: number): Promise<any> {
    try {
      const _thePost = await this.blogRepository.findBlogPost({ id: +post_id });
      if (!_thePost) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

      return _thePost;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for retrieving all blog posts
   * @param fetchPostsDto
   * @returns {Promise<any>}
   */

  async fetchAllPosts(fetchPostsDto: FetchPostsDto): Promise<any> {
    try {
      const { page, limit, search } = fetchPostsDto;

      function allPostsData() {
        return { page: +page, limit: +limit, search };
      }
      const { posts, count } = await this.blogRepository.findAllPosts(allPostsData());
      return { posts, count };
    } catch (error) {
      // console.log(error);
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }

  /**
   * @Responsibility: dedicated service for editing a blog post
   * @param editPostDto
   * @returns {Promise<any>}
   */

  async editPost(editPostDto: EditPostDto): Promise<any> {
    try {
      const { title, creator, content, post_id } = editPostDto;

      const _thePost = await this.blogRepository.findBlogPost({ id: +post_id });
      if (!_thePost) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

      function editData() {
        return {
          title,
          creator,
          content,
        };
      }

      await this.blogRepository.updateBlogPost(editData(), { id: +post_id });
      return {};
    } catch (error) {
      // console.log(error);
      throw new HttpException(error?.response ? error.response : this.ISE, error?.status);
    }
  }
}
