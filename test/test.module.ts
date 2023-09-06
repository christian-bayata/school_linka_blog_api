import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/schema/auth.schema';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.TEST_DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
      models: [User],
    }),
  ],
  providers: [AuthService, AuthRepository],
})
export class TestModule {}
