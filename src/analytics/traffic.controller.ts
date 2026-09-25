import { Body, Controller, ForbiddenException, Get, Headers, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { timingSafeEqual } from 'crypto';
import { TrafficService } from './traffic.service';
import { CollectDto } from './dto/collect.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const PERIODS = [7, 30, 365];

@ApiTags('analytics')
@Controller('analytics')
export class TrafficController {
  constructor(private readonly traffic: TrafficService) {}

  /**
   * Ingestion, called only by the Next.js /api/collect route (server-to-server), which has already
   * removed the IP. Protected by a shared secret instead of rate limiting: every request comes
   * from the same Vercel servers, so per-IP throttling would block real traffic.
   */
  @Post('collect')
  @HttpCode(204)
  @SkipThrottle()
  @ApiOperation({ summary: 'Record an anonymous page view or event (internal, x-ingest-key required)' })
  async collect(@Headers('x-ingest-key') key: string | undefined, @Body() dto: CollectDto) {
    const expected = process.env.ANALYTICS_INGEST_KEY;
    const ok =
      !!expected && !!key && key.length === expected.length && timingSafeEqual(Buffer.from(key), Buffer.from(expected));
    if (!ok) throw new ForbiddenException();
    await this.traffic.collect(dto);
  }

  @Get('traffic')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Visitor analytics report (days = 7, 30 or 365)' })
  report(@Query('days') days?: string) {
    const d = Number(days);
    return this.traffic.report(PERIODS.includes(d) ? d : 30);
  }
}
