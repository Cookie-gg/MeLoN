import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.PORT !== undefined }),
  );
  app.enableCors({
    origin: [`${process.env.FRONT_URL}`, 'https://cookie-gg.dev', /https:\/\/.*?cookie-gg\.vercel\.app/],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
