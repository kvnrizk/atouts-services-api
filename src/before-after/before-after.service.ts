import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBeforeAfterDto } from './dto/create-before-after.dto';
import { UpdateBeforeAfterDto } from './dto/update-before-after.dto';
import { BeforeAfter } from './entities/before-after.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class BeforeAfterService {
  constructor(
    @InjectRepository(BeforeAfter)
    private beforeAfterRepository: Repository<BeforeAfter>,
  ) {}

  async create(createBeforeAfterDto: CreateBeforeAfterDto): Promise<BeforeAfter> {
    const beforeAfter = this.beforeAfterRepository.create(createBeforeAfterDto);
    return this.beforeAfterRepository.save(beforeAfter);
  }

  async findAll(published?: boolean): Promise<BeforeAfter[]> {
    if (published !== undefined) {
      return this.beforeAfterRepository.find({
        where: { published },
        order: { createdAt: 'DESC' },
      });
    }
    return this.beforeAfterRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<BeforeAfter[]> {
    return this.beforeAfterRepository.find({
      where: { category, published: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<BeforeAfter> {
    const beforeAfter = await this.beforeAfterRepository.findOne({ where: { id } });
    if (!beforeAfter) {
      throw new NotFoundException(`Before/After project with ID ${id} not found`);
    }
    return beforeAfter;
  }

  async update(id: number, updateBeforeAfterDto: UpdateBeforeAfterDto): Promise<BeforeAfter> {
    const beforeAfter = await this.findOne(id);
    Object.assign(beforeAfter, updateBeforeAfterDto);
    return this.beforeAfterRepository.save(beforeAfter);
  }

  async remove(id: number): Promise<void> {
    const beforeAfter = await this.findOne(id);
    await this.deleteFileIfLocal(beforeAfter.beforeImageUrl);
    await this.deleteFileIfLocal(beforeAfter.afterImageUrl);
    await this.beforeAfterRepository.remove(beforeAfter);
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
