import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new testimonial (admin only)' })
  @ApiResponse({ status: 201, description: 'Testimonial created successfully' })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get published testimonials (public, filterable)' })
  @ApiResponse({ status: 200, description: 'Returns published testimonials' })
  findAllPublished(
    @Query('featured') featured?: string,
    @Query('projectType') projectType?: string,
  ) {
    const featuredFilter = featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.testimonialsService.findAllPublished(featuredFilter, projectType);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all testimonials including unpublished (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all testimonials' })
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a testimonial (admin only)' })
  @ApiResponse({ status: 200, description: 'Testimonial updated successfully' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialsService.update(+id, updateTestimonialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a testimonial (admin only)' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted successfully' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(+id);
  }
}
