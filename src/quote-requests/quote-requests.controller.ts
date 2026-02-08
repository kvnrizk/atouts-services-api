import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { QuoteRequestsService } from './quote-requests.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteRequestStatusDto } from './dto/update-quote-request-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('quote-requests')
@Controller('quote-requests')
export class QuoteRequestsController {
  constructor(private readonly quoteRequestsService: QuoteRequestsService) {}

  @Post()
  @Throttle({ short: { ttl: 60000, limit: 3 } }) // 3 quote requests per minute per IP
  @ApiOperation({ summary: 'Create a new quote request (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Quote request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 429, description: 'Too many requests - please try again later' })
  create(@Body() createQuoteRequestDto: CreateQuoteRequestDto) {
    return this.quoteRequestsService.create(createQuoteRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all quote requests (admin only, paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated quote requests' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    return this.quoteRequestsService.findAll(p, l);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quote request statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns statistics' })
  getStats() {
    return this.quoteRequestsService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a quote request by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the quote request' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  findOne(@Param('id') id: string) {
    return this.quoteRequestsService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update quote request status (admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateQuoteRequestStatusDto) {
    return this.quoteRequestsService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a quote request (admin only)' })
  @ApiResponse({ status: 200, description: 'Quote request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quote request not found' })
  remove(@Param('id') id: string) {
    return this.quoteRequestsService.remove(+id);
  }
}
