import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { QuoteRequestsService } from './quote-requests.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteRequestStatusDto } from './dto/update-quote-request-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailService } from '../email/email.service';

@ApiTags('quote-requests')
@Controller('quote-requests')
export class QuoteRequestsController {
  constructor(
    private readonly quoteRequestsService: QuoteRequestsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @Throttle({ short: { ttl: 60000, limit: 3 } }) // 3 quote requests per minute per IP
  @ApiOperation({ summary: 'Create a new quote request (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Quote request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 429, description: 'Too many requests - please try again later' })
  async create(@Body() createQuoteRequestDto: CreateQuoteRequestDto) {
    const quote = await this.quoteRequestsService.create(createQuoteRequestDto);

    // Send emails asynchronously (don't block the response)
    Promise.all([
      this.emailService.sendAdminNotification(quote),
      this.emailService.sendClientConfirmation(quote),
    ]).catch(() => {
      // Emails are best-effort — don't fail the request
    });

    return quote;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all quote requests (admin only, paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated quote requests' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    return this.quoteRequestsService.findAll(p, l);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quote request statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns statistics' })
  getStats() {
    return this.quoteRequestsService.getStats();
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export quote requests as CSV (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns CSV file' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.quoteRequestsService.exportCsv();
    const filename = `devis_${new Date().toISOString().slice(0, 10)}.csv`;

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(csv);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a quote request by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the quote request' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  findOne(@Param('id') id: string) {
    return this.quoteRequestsService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update quote request status (admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateQuoteRequestStatusDto) {
    return this.quoteRequestsService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a quote request (admin only)' })
  @ApiResponse({ status: 200, description: 'Quote request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  remove(@Param('id') id: string) {
    return this.quoteRequestsService.remove(+id);
  }
}
