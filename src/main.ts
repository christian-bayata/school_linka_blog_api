import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { AllExceptionsFilter } from './exceptions/http-exception';
import { HttpExceptionFilter } from './exceptions/http-exception';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.setGlobalPrefix('api/v1');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
