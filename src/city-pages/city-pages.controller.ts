import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CityPagesService } from './city-pages.service';
import { CreateCityPageDto } from './dto/create-city-page.dto';
import { UpdateCityPageDto } from './dto/update-city-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('city-pages')
@Controller('city-pages')
export class CityPagesController {
  constructor(private readonly cityPagesService: CityPagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new city page (admin only)' })
  @ApiResponse({ status: 201, description: 'City page created successfully' })
  create(@Body() createCityPageDto: CreateCityPageDto) {
    return this.cityPagesService.create(createCityPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published city pages (public)' })
  @ApiResponse({ status: 200, description: 'Returns published city pages' })
  findAllPublished() {
    return this.cityPagesService.findAllPublished();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all city pages including unpublished (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all city pages' })
  findAll() {
    return this.cityPagesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a city page by slug (public)' })
  @ApiResponse({ status: 200, description: 'Returns the city page' })
  @ApiResponse({ status: 404, description: 'City page not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.cityPagesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a city page (admin only)' })
  @ApiResponse({ status: 200, description: 'City page updated successfully' })
  @ApiResponse({ status: 404, description: 'City page not found' })
  update(@Param('id') id: string, @Body() updateCityPageDto: UpdateCityPageDto) {
    return this.cityPagesService.update(+id, updateCityPageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a city page (admin only)' })
  @ApiResponse({ status: 200, description: 'City page deleted successfully' })
  @ApiResponse({ status: 404, description: 'City page not found' })
  remove(@Param('id') id: string) {
    return this.cityPagesService.remove(+id);
  }
}
