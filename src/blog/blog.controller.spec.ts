import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../schema/auth.schema';
import { Blog } from '../schema/blog.schema';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as jwt from 'jsonwebtoken';
import { Authorize } from '../schema/authorize.schema';
import { BlogController } from './blog.controller';
import { EngagementController } from './engagements/engagement.controller';
import { BlogRepository } from './blog.repository';
import { BlogModule } from './blog.module';
import { Role } from '../common/enums/role.enum';
import { Engagement } from '../schema/engagement.schema';
import { DatabaseModule } from '../config/database/db.module';

let BASE_URL = '/linka-blog';
let token: string;

describe('Blog Controller', () => {
  let app: INestApplication;
  let blogRepository: BlogRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BlogModule],
      controllers: [BlogController],
    })
      .overrideProvider(blogRepository)
      .useValue(blogRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    token = jwt.sign({ user_id: 1, role: Role.RWX_USER }, process.env.JWT_SECRET);

    await User.destroy({ where: {}, truncate: true });
    await Blog.destroy({ where: {}, truncate: true });
    await Engagement.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await app.close();
  });

  /*****************************************************************************************************************************
   *
   **************************************** POST BLOGS SECTION **********************************
   *
   ******************************************************************************************************************************
   */

  /*************************************** Create Blog Post  ***************************************/
  describe('Create Blog Post', () => {
    it('should fail if title is not a string', async () => {
      function payload() {
        return {
          title: 12346,
          content: 'my_good_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if title is not provided', async () => {
      function payload() {
        return {
          content: 'my_good_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if title is empty', async () => {
      function payload() {
        return {
          title: '',
          content: 'my_good_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if content is not a string', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: 12345678,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if content is not provided', async () => {
      function payload() {
        return {
          title: 'my_title',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if content is empty', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: '',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should pass if all requirements are met', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: 'my_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/post/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Fetch Single Blog Post  ***************************************/
  describe('Fetch Single Blog Post', () => {
    it('should fail if blog id is not found', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/post/single?post_id=100`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requirements are met', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/post/single?post_id=${__post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Fetch Single Blog Post  ***************************************/
  describe('Fetch Single Blog Post', () => {
    it('should fail if blog id is not found', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/post/single?post_id=100`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requirements are met', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/post/single?post_id=${__post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Fetch All Blog Posts  ***************************************/
  describe('Fetch All Blog Posts', () => {
    it('should return all posts without pagination', async () => {
      const bulkData = [
        { title: 'my_title_1', content: 'my_content_1', creator: 10 },
        { title: 'my_title_2', content: 'my_content_2', creator: 10 },
        { title: 'my_title_3', content: 'my_content_3', creator: 10 },
      ];
      bulkData.map(async (data: any) => await Blog.create(data));

      const response = await request(app.getHttpServer()).get(`${BASE_URL}/post/all`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.data.posts.length).toBe(6);
    });

    it('should return post with pagination', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/post/all?page=1&limit=3`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.data.posts.length).toBe(3);
    });

    it('should return post after search', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/post/all?search=my_title_1`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.data.posts.length).toBe(1);
    });
  });

  /*************************************** Edit Blog Post  ***************************************/
  describe(' Edit Blog Post', () => {
    it('should fail if title is not a string', async () => {
      function payload() {
        return {
          title: 12346,
          content: 'my_good_content',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if title is not provided', async () => {
      function payload() {
        return {
          content: 'my_good_content',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if title is empty', async () => {
      function payload() {
        return {
          title: '',
          content: 'my_good_content',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if content is not a string', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: 12345678,
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if content is not provided', async () => {
      function payload() {
        return {
          title: 'my_title',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if content is empty', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: '',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if post id is not a number', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: 'my_content',
          post_id: 'abcf',
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/number/i);
    });

    it('should fail if post id is not found', async () => {
      function payload() {
        return {
          title: 'my_title',
          content: 'my_content',
          post_id: 120,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requirements are met', async () => {
      const post = await Blog.create({ title: 'my_title_1.1', content: 'my_content_1', creator: 10 });
      function payload() {
        return {
          title: 'my_updated_title',
          content: 'my_content',
          post_id: post.id,
        };
      }
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/post/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Delete Blog Post  ***************************************/
  describe(' Delete Blog Post', () => {
    it('should fail if post id is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/post/delete?post_id=120`)
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requiremnets are met', async () => {
      const post = await Blog.create({ title: 'my_title_1.1', content: 'my_content_1', creator: 10 });
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/post/delete?post_id=${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** POST ENGAGEMENTS SECTION **********************************
   *
   ******************************************************************************************************************************
   */

  /*************************************** Create Engagement on Post  ***************************************/
  describe('Create Engagement on Post', () => {
    it('should fail if flag is not a string', async () => {
      function payload() {
        return {
          flag: 12346,
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if flag is not provided', async () => {
      function payload() {
        return {
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if flag is empty', async () => {
      function payload() {
        return {
          flag: 'something_else',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid flag/i);
    });

    it('should fail if flag is not view, like or comment', async () => {
      function payload() {
        return {
          flag: '',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should pass for view flag', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });

      function payload() {
        return {
          flag: 'view',
          post_id: __post.id,
        };
      }

      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/viewed post/i);
    });

    it('should pass for like flag', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });

      function payload() {
        return {
          flag: 'like',
          post_id: __post.id,
        };
      }

      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/liked post/i);
    });

    it('should pass for comment flag', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });

      function payload() {
        return {
          flag: 'comment',
          post_id: __post.id,
          comment: 'some_wonderful_comment',
        };
      }

      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/engagement/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/commented/i);
    });
  });

  /*************************************** Delete Engagement on Post  ***************************************/
  describe('Delete Engagement on Post', () => {
    it('should fail if flag is not a string', async () => {
      function payload() {
        return {
          flag: 12346,
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if flag is not present', async () => {
      function payload() {
        return {
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if flag is empty', async () => {
      function payload() {
        return {
          flag: '',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if post id is not provided', async () => {
      function payload() {
        return {
          flag: 'unlike',
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if post id does not exit', async () => {
      function payload() {
        return {
          flag: 'unlike',
          post_id: 200,
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/deleted/i);
    });

    it('should fail if flag is not delete_comment or unlike', async () => {
      function payload() {
        return {
          flag: 'some_flag_like_that',
          post_id: 2,
        };
      }
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should pass for unlike flag', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });
      const __eng = await Engagement.create({ post_id: __post?.id, type: 'like', engager: 1 });

      function payload() {
        return {
          flag: 'unlike',
          post_id: __eng?.post_id,
        };
      }

      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/un-liked post/i);
    });

    it('should pass for delete comment flag', async () => {
      const __post = await Blog.create({ title: 'my_second_title', content: 'my_second_content', creator: 1 });
      const __eng = await Engagement.create({ post_id: __post?.id, type: 'comment', engager: 1, comment: 'some_comment' });

      function payload() {
        return {
          flag: 'delete_comment',
          post_id: __eng?.post_id,
        };
      }

      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/engagement/delete`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/deleted/i);
    });
  });
});
