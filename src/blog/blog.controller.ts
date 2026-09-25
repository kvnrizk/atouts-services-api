import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (admin only)' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Get()
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get published blog posts (public, paginated)' })
  @ApiResponse({ status: 200, description: 'Returns published blog posts' })
  findAllPublished(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.blogService.findAllPublished(
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog posts including unpublished (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all blog posts' })
  findAll() {
    return this.blogService.findAll();
  }

  @Get('category/:category')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get published blog posts by category (public)' })
  @ApiResponse({ status: 200, description: 'Returns blog posts for the category' })
  findByCategory(@Param('category') category: string) {
    return this.blogService.findByCategory(category);
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  @ApiOperation({ summary: 'Get a blog post by slug (public)' })
  @ApiResponse({ status: 200, description: 'Returns the blog post' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(+id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
