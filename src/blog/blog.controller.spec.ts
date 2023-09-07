import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../schema/auth.schema';
import { Blog } from '../schema/blog.schema';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { genSaltSync, hashSync } from 'bcrypt';
import { Authorize } from '../schema/authorize.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { BlogModule } from './blog.module';
import { Role } from '../common/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';

let BASE_URL = '/linka-blog/post';
let token: string;

describe('Blog Controller', () => {
  let app: INestApplication;
  let module: TestingModule;
  let blogService: BlogService;
  let blogRepository: BlogRepository;
  let configService: ConfigService;

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
    await Authorize.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await app.close();
  });

  /*************************************** Create Blog Post  ***************************************/
  describe('Create Blog Post', () => {
    it('should fail if title is not a string', async () => {
      function payload() {
        return {
          title: 12346,
          content: 'my_good_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if title is not provided', async () => {
      function payload() {
        return {
          content: 'my_good_content',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if content is not provided', async () => {
      function payload() {
        return {
          title: 'my_title',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/create`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Fetch Single Blog Post  ***************************************/
  describe('Fetch Single Blog Post', () => {
    it('should fail if blog id is not found', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/single?post_id=100`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requirements are met', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/single?post_id=${__post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Fetch Single Blog Post  ***************************************/
  describe('Fetch Single Blog Post', () => {
    it('should fail if blog id is not found', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/single?post_id=100`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requirements are met', async () => {
      const __post = await Blog.create({ title: 'my_title', content: 'my_content', creator: 1 });
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/single?post_id=${__post.id}`)
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

      const response = await request(app.getHttpServer()).get(`${BASE_URL}/all`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.data.posts.length).toBe(6);
    });

    it('should return post with pagination', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/all?page=1&limit=3`).set('Authorization', `Bearer ${token}`).send();
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.data.posts.length).toBe(3);
    });

    it('should return post after search', async () => {
      const response = await request(app.getHttpServer()).get(`${BASE_URL}/all?search=my_title_1`).set('Authorization', `Bearer ${token}`).send();
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
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
      const response = await request(app.getHttpServer()).patch(`${BASE_URL}/edit`).set('Authorization', `Bearer ${token}`).send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Delete Blog Post  ***************************************/
  describe(' Delete Blog Post', () => {
    it('should fail if post id is not found', async () => {
      const response = await request(app.getHttpServer()).delete(`${BASE_URL}/delete?post_id=120`).set('Authorization', `Bearer ${token}`).send({});
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should pass if all requiremnets are met', async () => {
      const post = await Blog.create({ title: 'my_title_1.1', content: 'my_content_1', creator: 10 });
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/delete?post_id=${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });
});
