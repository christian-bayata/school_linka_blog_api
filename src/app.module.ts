import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, EmailModule, BlogModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
