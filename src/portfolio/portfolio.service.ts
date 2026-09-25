import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create(createPortfolioDto);
    return await this.portfolioRepository.save(portfolio);
  }

  async findAll(published?: boolean): Promise<Portfolio[]> {
    const where = published !== undefined ? { published } : {};
    return await this.portfolioRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio item with ID ${id} not found`);
    }

    return portfolio;
  }

  async findByCategory(category: string): Promise<Portfolio[]> {
    return await this.portfolioRepository.find({
      where: { category, published: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: number, updatePortfolioDto: UpdatePortfolioDto): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    Object.assign(portfolio, updatePortfolioDto);
    return await this.portfolioRepository.save(portfolio);
  }

  async remove(id: number): Promise<void> {
    const portfolio = await this.findOne(id);
    await this.deleteFileIfLocal(portfolio.imageUrl);
    await this.portfolioRepository.remove(portfolio);
  }

  private async deleteFileIfLocal(fileUrl: string): Promise<void> {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
    try {
      const filePath = join(__dirname, '..', '..', fileUrl);
      await unlink(filePath);
    } catch {
      // File may not exist on disk — ignore
    }
  }
}
