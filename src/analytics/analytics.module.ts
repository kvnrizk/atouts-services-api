import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { PageView } from './entities/page-view.entity';
import { SiteEvent } from './entities/site-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageView, SiteEvent])],
  controllers: [AnalyticsController, TrafficController],
  providers: [AnalyticsService, TrafficService],
})
export class AnalyticsModule {}
