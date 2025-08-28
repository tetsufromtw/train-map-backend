import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS設定 - フロントエンド統合用
  app.enableCors({
    origin: [
      'http://localhost:3000',     // Next.js開発サーバー
      'http://localhost:3001',     // React開発サーバー
      'http://localhost:5173',     // Vite開発サーバー
      'http://localhost:4200',     // Angular開発サーバー
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001', 
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4200'
    ],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With', 
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control'
    ],
    optionsSuccessStatus: 200
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Train Map Backend API')
    .setDescription('FAANG-style NestJS backend for train map application')
    .setVersion('1.0')
    .addTag('companies', 'Railway company management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
