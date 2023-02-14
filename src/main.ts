import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setBaseViewsDir(path.resolve(__dirname, './assets/email/template'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  var whitelist = ['https://website.com', 'https://www.website.com'];
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription(' Marketplace API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'access-token'
    )
    .build();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);
  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(`:rocket: Application is running on: http://localhost:${port}`);
}

bootstrap();
