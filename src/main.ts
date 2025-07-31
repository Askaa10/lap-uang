import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hanya terima field yang ada di DTO
      forbidNonWhitelisted: true, // error jika ada field asing
      transform: true, // otomatis transformasi tipe (string -> number, boolean, dll)
    }),
  );
  await app.listen(process.env.PORT ?? 3232);
}
bootstrap();
