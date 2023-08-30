import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || 3030;
  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
