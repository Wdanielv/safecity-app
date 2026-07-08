import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SAFECITY API')
    .setDescription(
      'API del MVP de SAFECITY — Red Inteligente y Colaborativa de Seguridad Ciudadana.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`SAFECITY API escuchando en http://localhost:${port}/api/v1`);
  console.log(`Documentación Swagger en http://localhost:${port}/api/docs`);
}

bootstrap().catch((error: Error) => {
  console.error('Error al iniciar la aplicación:', error.message);
  process.exit(1);
});
