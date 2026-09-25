import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';

// Validate required environment variables
function validateEnvironment() {
  const requiredEnvVars = ['JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
        `Please check your .env file and ensure all required variables are set.`,
    );
  }

  // Validate JWT_SECRET length for security
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security.');
  }

  // Check database configuration
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDbConfig = !!(
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USER &&
    process.env.DATABASE_PASSWORD &&
    process.env.DATABASE_NAME
  );

  if (!hasDbUrl && !hasDbConfig) {
    throw new Error(
      'Missing database configuration. Please provide either:\n' +
        '1. DATABASE_URL (for production)\n' +
        '2. DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME (for local development)',
    );
  }

  console.log('✓ Environment validation passed');
}

async function bootstrap() {
  // Validate environment variables before starting the app
  validateEnvironment();

  // Ensure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads directory');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Raw body parser for Stripe webhook (must be before JSON parser)
  const express = require('express');
  app.use(
    '/payments/webhook',
    express.raw({ type: 'application/json' }),
  );

  // Set request size limits to prevent large payload attacks
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Enable Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow embedding for Swagger UI
    }),
  );

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:5173'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable class serializer so @Exclude() decorators work (e.g. User.password)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger configuration - only in development, and only with an explicit password
  // (no default password, and the password is never printed in the logs).
  const swaggerPassword = process.env.SWAGGER_PASSWORD;
  if (process.env.NODE_ENV !== 'production' && swaggerPassword) {
    // Protect Swagger with basic authentication
    const swaggerUser = process.env.SWAGGER_USER || 'admin';

    app.use(
      ['/api', '/api-json'],
      basicAuth({
        challenge: true,
        users: {
          [swaggerUser]: swaggerPassword,
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Atouts Services API')
      .setDescription('The Atouts Services API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('access_token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 8080}/api`);
    console.log(`Swagger user: ${swaggerUser} (password from SWAGGER_PASSWORD)`);
  }

  await app.listen(process.env.PORT ?? 8080);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 8080}`);
}
bootstrap();
