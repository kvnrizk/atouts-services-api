import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get aggregated dashboard overview' })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue over time' })
  getRevenue() {
    return this.analyticsService.getRevenue();
  }

  @Get('conversions')
  @ApiOperation({ summary: 'Get conversion funnel' })
  getConversions() {
    return this.analyticsService.getConversions();
  }

  @Get('quote-trends')
  @ApiOperation({ summary: 'Get monthly quote trends' })
  getQuoteTrends() {
    return this.analyticsService.getQuoteTrends();
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get traffic source breakdown' })
  getSources() {
    return this.analyticsService.getSources();
  }

  @Get('popular-services')
  @ApiOperation({ summary: 'Get popular services' })
  getPopularServices() {
    return this.analyticsService.getPopularServices();
  }
}
