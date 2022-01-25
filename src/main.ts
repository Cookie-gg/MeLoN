import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/https:\/\/.*?cookie-gg\.dev/, /https:\/\/.*?cookie-gg\.vercel\.app/],
      credentials: true,
    },
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
