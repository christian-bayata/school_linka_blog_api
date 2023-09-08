import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { User } from 'src/schema/auth.schema';
import { Blog } from 'src/schema/blog.schema';
import { TestModule } from '../test.module';
import { AuthRepository } from 'src/auth/auth.repository';
import * as app from '../../src/main';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { INestApplication } from '@nestjs/common';

let BASE_URL = '/api/v1/linka-blog/auth';
describe('Auth Controller', () => {
  let app: INestApplication;
  let module: TestingModule;
  let controller: AuthController;
  let service: AuthService;
  let repository: AuthRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [AuthController],
      providers: [AuthService, AuthRepository],
    }).compile();
    repository = module.get<AuthRepository>(AuthRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Sign Up', async () => {
    function payload() {
      return {
        last_name: 'my_lastname',
        email: 'my_email@gmail.com',
        password: 'my_password',
      };
    }
    const response = await request(app).post(`${BASE_URL}/sign-up`).send(payload());
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/required/i);
  });
});
