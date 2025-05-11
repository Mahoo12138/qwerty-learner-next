import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Qwerty-learner API Doc')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('restful')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
