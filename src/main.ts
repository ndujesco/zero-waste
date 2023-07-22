import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;
  await app.listen(3000);
  logger.verbose(`\nThe application is running on port ${port}`);
}
bootstrap();
