import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ['https://kpd.ryabchulya.nomorepartiessbs.ru'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // если работаешь с cookie / Authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
