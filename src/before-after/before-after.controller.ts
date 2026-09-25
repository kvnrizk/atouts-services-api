import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BeforeAfterService } from './before-after.service';
import { CreateBeforeAfterDto } from './dto/create-before-after.dto';
import { UpdateBeforeAfterDto } from './dto/update-before-after.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('before-after')
@Controller('before-after')
export class BeforeAfterController {
  constructor(private readonly beforeAfterService: BeforeAfterService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new before/after project (admin only)' })
  @ApiResponse({ status: 201, description: 'Before/After project created successfully' })
  create(@Body() createBeforeAfterDto: CreateBeforeAfterDto) {
    return this.beforeAfterService.create(createBeforeAfterDto);
  }

  @Get()
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get all before/after projects (public - returns only published by default)' })
  @ApiResponse({ status: 200, description: 'Returns all before/after projects' })
  findAll(@Query('published') published?: string) {
    const publishedFilter = published === 'false' ? false : true;
    return this.beforeAfterService.findAll(publishedFilter);
  }

  @Get('category/:category')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get before/after projects by category (public)' })
  @ApiResponse({ status: 200, description: 'Returns before/after projects for the category' })
  findByCategory(@Param('category') category: string) {
    return this.beforeAfterService.findByCategory(category);
  }

  @Get(':id')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get a before/after project by ID (public)' })
  @ApiResponse({ status: 200, description: 'Returns the before/after project' })
  @ApiResponse({ status: 404, description: 'Before/After project not found' })
  findOne(@Param('id') id: string) {
    return this.beforeAfterService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a before/after project (admin only)' })
  @ApiResponse({ status: 200, description: 'Before/After project updated successfully' })
  @ApiResponse({ status: 404, description: 'Before/After project not found' })
  update(@Param('id') id: string, @Body() updateBeforeAfterDto: UpdateBeforeAfterDto) {
    return this.beforeAfterService.update(+id, updateBeforeAfterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a before/after project (admin only)' })
  @ApiResponse({ status: 200, description: 'Before/After project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Before/After project not found' })
  remove(@Param('id') id: string) {
    return this.beforeAfterService.remove(+id);
  }
}
