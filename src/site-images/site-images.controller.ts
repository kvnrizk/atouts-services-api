import { BadRequestException, Body, Controller, Delete, Get, Header, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SiteImagesService } from './site-images.service';
import { SetSiteImageDto } from './dto/set-site-image.dto';

// Keys are the ids of the frontend photo registry (letters, digits, dash, underscore).
// Checked in code: NestJS 11 (path-to-regexp v8) no longer accepts inline regex in routes.
const KEY_FORMAT = /^[A-Za-z0-9_-]{1,60}$/;
function checkKey(key: string): string {
  if (!KEY_FORMAT.test(key)) throw new BadRequestException('Invalid photo key');
  return key;
}

@ApiTags('site-images')
@Controller('site-images')
export class SiteImagesController {
  constructor(private readonly siteImagesService: SiteImagesService) {}

  @Get()
  @Header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  @ApiOperation({ summary: 'Replaced site photos, as { key: url } (public)' })
  findAll() {
    return this.siteImagesService.findAll();
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Replace a built-in site photo (admin only)' })
  set(@Param('key') key: string, @Body() dto: SetSiteImageDto) {
    return this.siteImagesService.set(checkKey(key), dto.url);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Go back to the original photo (admin only)' })
  remove(@Param('key') key: string) {
    return this.siteImagesService.remove(checkKey(key));
  }
}
