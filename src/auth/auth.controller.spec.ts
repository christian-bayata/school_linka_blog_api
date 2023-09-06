import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../schema/auth.schema';
import { Blog } from '../schema/blog.schema';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AppModule } from '../app.module';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import { genSaltSync, hashSync } from 'bcrypt';
import { Authorize } from '../schema/authorize.schema';

let BASE_URL = '/linka-blog/auth';

export interface DatabaseProvider {
  getSequelizeInstance(): Promise<Sequelize>;
}

describe('Auth Controller', () => {
  let app: INestApplication;
  let module: TestingModule;
  let controller: AuthController;
  let authService: AuthService;
  let authRepository: AuthRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      controllers: [AuthController],
    })
      .overrideProvider(authRepository)
      .useValue(authRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await User.destroy({ where: {}, truncate: true });
    await Blog.destroy({ where: {}, truncate: true });
    await Authorize.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await app.close();
  });

  /*************************************** Sign up  ***************************************/
  describe('Auth Sign Up', () => {
    it('should fail if the first name is not provided', async () => {
      function payload() {
        return {
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if the first name is not a string', async () => {
      function payload() {
        return {
          first_name: 1234,
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if the first name is less than 3 characters', async () => {
      function payload() {
        return {
          first_name: 'ab',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/3 characters/i);
    });

    it('should fail if the first name is empty', async () => {
      function payload() {
        return {
          first_name: '',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if the last name is not provided', async () => {
      function payload() {
        return {
          first_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if the last name is not a string', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 1234,
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if the last name is less than 3 characters', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'ab',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/3 characters/i);
    });

    it('should fail if the last name is empty', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: '',
          email: 'my_email@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if email is not a string', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: 12346,
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if email is not provided', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if email is empty', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: '',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if the password is not provided', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if the password is not a string', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 2345654,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if the password is less than 3 characters', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: 'sd',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/3 characters/i);
    });

    it('should fail if the password is empty', async () => {
      function payload() {
        return {
          first_name: 'my_firstname',
          last_name: 'my_lastname',
          email: 'my_email@gmail.com',
          password: '',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if the email already exists', async () => {
      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email@gmail.com',
        password: hashSync('my_password', genSaltSync()),
      });

      function payload() {
        return {
          first_name: 'my_firstname_1',
          last_name: 'my_lastname_1',
          email: 'my_email@gmail.com',
          password: hashSync('my_password_1', genSaltSync()),
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/exists/i);
    });
  });

  it('should create user if all requirements are met', async () => {
    function payload() {
      return {
        first_name: 'my_firstname_1',
        last_name: 'my_lastname_1',
        email: 'my_email_1@gmail.com',
        password: hashSync('my_password_1', genSaltSync()),
      };
    }
    const response = await request(app.getHttpServer()).post(`${BASE_URL}/sign-up`).send(payload());
    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/successfully/i);
  });

  /*************************************** Login  ***************************************/
  describe('Auth Login', () => {
    it('should fail if email is not a string', async () => {
      function payload() {
        return {
          email: 12346,
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if email is not provided', async () => {
      function payload() {
        return {
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if email is empty', async () => {
      function payload() {
        return {
          email: '',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if the password is not provided', async () => {
      function payload() {
        return {
          email: 'my_email@gmail.com',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if the password is not a string', async () => {
      function payload() {
        return {
          email: 'my_email@gmail.com',
          password: 2345654,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if the password is empty', async () => {
      function payload() {
        return {
          email: 'my_email@gmail.com',
          password: '',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if the email does not exist', async () => {
      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email@gmail.com',
        password: hashSync('my_password', genSaltSync()),
      });

      function payload() {
        return {
          email: 'my_email_111@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should fail if the password does not match', async () => {
      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email@gmail.com',
        password: hashSync('my_password', genSaltSync()),
      });

      function payload() {
        return {
          email: 'my_email@gmail.com',
          password: 'my_password123',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should pass if all requirements are met', async () => {
      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email11@gmail.com',
        password: hashSync('my_password', genSaltSync()),
      });

      function payload() {
        return {
          email: 'my_email11@gmail.com',
          password: 'my_password',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/login`).send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
    });
  });

  /*************************************** Verification ***************************************/
  describe('Auth Verification', () => {
    const __ver_id = uuidv4();

    it('should fail if email is not a string', async () => {
      function payload() {
        return {
          email: 12346,
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if email is not provided', async () => {
      function payload() {
        return {
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if email is empty', async () => {
      function payload() {
        return {
          email: '',
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/empty/i);
    });

    it('should fail if ver_id is not a string', async () => {
      function payload() {
        return {
          email: 'my_email@gmail.com',
          ver_id: 1234567,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/string/i);
    });

    it('should fail if ver_id is not provided', async () => {
      function payload() {
        return {
          email: 'my_email@gmail.com',
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should fail if email does not exist', async () => {
      function payload() {
        return {
          email: 'some_random_email_that_doesnt_exist@gmail.com',
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should fail if user supplies code that does not exist', async () => {
      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email11@gmail.com',
        password: hashSync('my_password', genSaltSync()),
        verified: true,
      });

      function payload() {
        return {
          email: 'my_email11@gmail.com',
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should pass if all requirments are met', async () => {
      await Authorize.create({
        email: 'my_email11@gmail.com',
        ver_id: __ver_id,
      });

      await User.create({
        first_name: 'my_firstname',
        last_name: 'my_lastname',
        email: 'my_email11@gmail.com',
        password: hashSync('my_password', genSaltSync()),
      });

      function payload() {
        return {
          email: 'my_email11@gmail.com',
          ver_id: __ver_id,
        };
      }
      const response = await request(app.getHttpServer()).post(`${BASE_URL}/verify`).send(payload());
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successfully/i);
    });

    /*************************************** Forgot Password ***************************************/
    describe('Auth Forgot Password', () => {
      it('should fail if email is not provided', async () => {
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/forgot-password`).send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/email/i);
      });

      it('should fail if email does not exist', async () => {
        function payload() {
          return {
            email: 'some_random_email1@gmail.com',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/forgot-password`).send(payload());
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/not found/i);
      });

      it('should pass if all requirements are met', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/forgot-password`).send(payload());
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/successfully/i);
      });
    });

    /*************************************** Reset Password ***************************************/
    describe('Auth Reset Password', () => {
      it('should fail if email is not a string', async () => {
        function payload() {
          return {
            email: 12346,
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/string/i);
      });

      it('should fail if email is not provided', async () => {
        function payload() {
          return {
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/required/i);
      });

      it('should fail if email is empty', async () => {
        function payload() {
          return {
            email: '',
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/empty/i);
      });

      it('should fail if code is not a string', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: 'my_password',
            code: 123456,
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/string/i);
      });

      it('should fail if code is not provided', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: 'my_password',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/required/i);
      });

      it('should fail if code is empty', async () => {
        function payload() {
          return {
            email: '',
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/empty/i);
      });

      it('should fail if password is not a string', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 1234456,
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/string/i);
      });

      it('should fail if password is not provided', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/required/i);
      });

      it('should fail if password is empty', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: '',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/empty/i);
      });

      it('should fail if confirm password is not provided', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/required/i);
      });

      it('should fail if confirm password is empty', async () => {
        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: '',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/empty/i);
      });

      it('should fail if code suplpied is invalid', async () => {
        await Authorize.create({ email: 'my_email11@gmail.com', code: '678092' });

        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '123456',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/i);
      });

      it('should fail if passwords do not match', async () => {
        await Authorize.create({ email: 'my_email11@gmail.com', code: '678092' });

        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: 'my_password11',
            code: '678092',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/not match/i);
      });

      it('should pass if all requirements are met', async () => {
        await Authorize.create({ email: 'my_email11@gmail.com', code: '678092' });

        function payload() {
          return {
            email: 'my_email11@gmail.com',
            password: 'my_password',
            confirmPassword: 'my_password',
            code: '678092',
          };
        }
        const response = await request(app.getHttpServer()).post(`${BASE_URL}/reset-password`).send(payload());
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/successful/i);
      });
    });
  });
});
