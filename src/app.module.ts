import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteRequestsModule } from './quote-requests/quote-requests.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { UploadModule } from './upload/upload.module';
import { BeforeAfterModule } from './before-after/before-after.module';
import { BlogModule } from './blog/blog.module';
import { CityPagesModule } from './city-pages/city-pages.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { SiteImagesModule } from './site-images/site-images.module';
import { PriceReferencesModule } from './price-references/price-references.module';
import { EstimationsModule } from './estimations/estimations.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RetentionModule } from './retention/retention.module';
import { ProjectsModule } from './projects/projects.module';
import { PaymentsModule } from './payments/payments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 60, // 60 requests per minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 200, // 200 requests per 15 minutes
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        const isProduction = configService.get('NODE_ENV') === 'production';

        const useSynchronize = configService.get('TYPEORM_SYNCHRONIZE') === 'true';

        // If DATABASE_URL exists, use it (Production deployment)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: useSynchronize,
            migrationsRun: !useSynchronize,
            logging: !isProduction,
            ssl: {
              rejectUnauthorized: isProduction, // Only verify SSL in production
            },
          };
        }

        // Otherwise use separate variables (local development)
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: +configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: useSynchronize,
          migrationsRun: !useSynchronize,
          logging: !isProduction,
        };
      },
      inject: [ConfigService],
    }),
    QuoteRequestsModule,
    AuthModule,
    UsersModule,
    PortfolioModule,
    UploadModule,
    BeforeAfterModule,
    BlogModule,
    CityPagesModule,
    TestimonialsModule,
    SiteImagesModule,
    PriceReferencesModule,
    EstimationsModule,
    ProjectsModule,
    PaymentsModule,
    AnalyticsModule,
    NewsletterModule,
    ScheduleModule.forRoot(),
    RetentionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
