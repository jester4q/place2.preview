import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ApiExceptionFilter } from './core/error/exception.filter';

async function bootstrap() {
  const options = {};

  const app = await NestFactory.create(AppModule, options);
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configSwagger = new DocumentBuilder()
    .setTitle('BPM api')
    .setDescription('All api method from BPM system')
    .setVersion('1.0')
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentSwagger);

  //app.useGlobalPipes(new ValidateInputPipe());
  app.use('/robots.txt', function (_req, res) {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });
  await app.listen(process.env.PORT);
}

bootstrap();
