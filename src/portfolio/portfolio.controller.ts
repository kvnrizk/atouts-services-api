import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new portfolio item (admin only)' })
  @ApiResponse({ status: 201, description: 'Portfolio item created successfully' })
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get all portfolio items (public - returns only published by default)' })
  @ApiResponse({ status: 200, description: 'Returns all portfolio items' })
  findAll(@Query('published') published?: string) {
    const publishedFilter = published === 'false' ? false : true;
    return this.portfolioService.findAll(publishedFilter);
  }

  @Get('category/:category')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get portfolio items by category (public)' })
  @ApiResponse({ status: 200, description: 'Returns portfolio items for the category' })
  findByCategory(@Param('category') category: string) {
    return this.portfolioService.findByCategory(category);
  }

  @Get(':id')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get a portfolio item by ID (public)' })
  @ApiResponse({ status: 200, description: 'Returns the portfolio item' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a portfolio item (admin only)' })
  @ApiResponse({ status: 200, description: 'Portfolio item updated successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  update(@Param('id') id: string, @Body() updatePortfolioDto: UpdatePortfolioDto) {
    return this.portfolioService.update(+id, updatePortfolioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a portfolio item (admin only)' })
  @ApiResponse({ status: 200, description: 'Portfolio item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(+id);
  }
}
