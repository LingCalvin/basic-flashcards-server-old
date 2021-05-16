import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get('ConfigService');
  app.enableCors({ origin: config.get('CORS_ORIGIN'), credentials: true });
  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(config.get('PORT', 3000));
}
bootstrap();
