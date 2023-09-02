import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { blogProvider } from './blog.provider';
import { sequelizeInstanceProvider } from 'src/auth/auth.provider';
import { BlogController } from './blog.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/guards/jwt/jwt.strategy';

@Module({
  controllers: [BlogController],
  imports: [
    ConfigModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BlogService, BlogRepository, ...blogProvider, ...sequelizeInstanceProvider, JwtStrategy],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
