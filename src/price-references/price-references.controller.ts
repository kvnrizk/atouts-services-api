import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PriceReferencesService } from './price-references.service';
import { CreatePriceReferenceDto } from './dto/create-price-reference.dto';
import { UpdatePriceReferenceDto } from './dto/update-price-reference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('price-references')
@Controller('price-references')
export class PriceReferencesController {
  constructor(private readonly priceReferencesService: PriceReferencesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a price reference (admin only)' })
  @ApiResponse({ status: 201, description: 'Price reference created' })
  create(@Body() dto: CreatePriceReferenceDto) {
    return this.priceReferencesService.create(dto);
  }

  @Get()
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'List active price references (public)' })
  @ApiResponse({ status: 200, description: 'Returns active price references' })
  findAllActive() {
    return this.priceReferencesService.findAllActive();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all price references including inactive (admin)' })
  @ApiResponse({ status: 200, description: 'Returns all price references' })
  findAll() {
    return this.priceReferencesService.findAll();
  }

  @Get('category/:category')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get price references by category (public)' })
  @ApiResponse({ status: 200, description: 'Returns price references for category' })
  findByCategory(@Param('category') category: string) {
    return this.priceReferencesService.findByCategory(category);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a price reference (admin only)' })
  @ApiResponse({ status: 200, description: 'Price reference updated' })
  update(@Param('id') id: string, @Body() dto: UpdatePriceReferenceDto) {
    return this.priceReferencesService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a price reference (admin only)' })
  @ApiResponse({ status: 200, description: 'Price reference deleted' })
  remove(@Param('id') id: string) {
    return this.priceReferencesService.remove(+id);
  }
}
