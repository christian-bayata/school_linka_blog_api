import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/config/database/db.module';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { authProvider, sequelizeInstanceProvider } from './auth.provider';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, ...authProvider, ...sequelizeInstanceProvider],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
