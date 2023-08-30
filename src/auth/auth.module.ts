import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/config/database/db.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule {}
