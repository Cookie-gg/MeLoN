import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [`${process.env.FRONT_URL}`, /https:\/\/.*?cookie-gg\.[dev|vercel][?\.app]/],
      credentials: true,
    },
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
