import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // app.setGlobalPrefix('/api/v1');
  const port = process.env.PORT || 8080;
  app.enableShutdownHooks();

  await app.listen(port);
  logger.verbose(`\nThe application is running on port ${port}\nE DEH RUSH!!`);
}

bootstrap();
