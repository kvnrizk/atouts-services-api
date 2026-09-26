import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteImageOverride } from './entities/site-image-override.entity';

@Injectable()
export class SiteImagesService {
  constructor(
    @InjectRepository(SiteImageOverride)
    private readonly repo: Repository<SiteImageOverride>,
  ) {}

  /** { key: url } for every replaced photo */
  async findAll(): Promise<Record<string, string>> {
    const rows = await this.repo.find();
    return Object.fromEntries(rows.map((r) => [r.key, r.url]));
  }

  async set(key: string, url: string): Promise<SiteImageOverride> {
    return this.repo.save({ key, url });
  }

  async remove(key: string): Promise<void> {
    await this.repo.delete({ key });
  }
}
