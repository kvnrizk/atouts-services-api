import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EstimationsService } from './estimations.service';
import { CalculateEstimationDto } from './dto/calculate-estimation.dto';
import { CaptureContactDto } from './dto/capture-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('estimations')
@Controller('estimations')
export class EstimationsController {
  constructor(private readonly estimationsService: EstimationsService) {}

  @Post('calculate')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Calculate a price estimation (public, rate-limited)' })
  @ApiResponse({ status: 201, description: 'Estimation calculated' })
  calculate(@Body() dto: CalculateEstimationDto) {
    return this.estimationsService.calculate(dto);
  }

  @Patch(':sessionId/contact')
  @ApiOperation({ summary: 'Add contact info to an estimation (public)' })
  @ApiResponse({ status: 200, description: 'Contact info saved' })
  captureContact(
    @Param('sessionId') sessionId: string,
    @Body() dto: CaptureContactDto,
  ) {
    return this.estimationsService.captureContact(sessionId, dto);
  }

  @Get(':sessionId/pdf')
  @ApiOperation({ summary: 'Download estimation as PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  async downloadPdf(
    @Param('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.estimationsService.generatePdf(sessionId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="estimation-atouts-services.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all estimations (admin)' })
  @ApiResponse({ status: 200, description: 'Returns all estimations' })
  findAll() {
    return this.estimationsService.findAll();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get estimation statistics (admin)' })
  @ApiResponse({ status: 200, description: 'Returns estimation stats' })
  getStats() {
    return this.estimationsService.getStats();
  }
}
