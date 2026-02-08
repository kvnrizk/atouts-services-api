import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const post = this.blogPostRepository.create(createBlogPostDto);
    if (post.published && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    return await this.blogPostRepository.save(post);
  }

  async findAllPublished(page = 1, limit = 10): Promise<{ data: BlogPost[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.blogPostRepository.findAndCount({
      where: { published: true },
      order: { publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findAll(): Promise<BlogPost[]> {
    return await this.blogPostRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { slug, published: true },
    });
    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }
    return post;
  }

  async findByCategory(category: string): Promise<BlogPost[]> {
    return await this.blogPostRepository.find({
      where: { category, published: true },
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findOne(id);
    const wasPublished = post.published;
    Object.assign(post, updateBlogPostDto);
    if (post.published && !wasPublished && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    return await this.blogPostRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.blogPostRepository.remove(post);
  }
}
