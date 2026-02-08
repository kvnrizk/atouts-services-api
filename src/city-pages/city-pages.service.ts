import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityPage } from './entities/city-page.entity';
import { CreateCityPageDto } from './dto/create-city-page.dto';
import { UpdateCityPageDto } from './dto/update-city-page.dto';

@Injectable()
export class CityPagesService {
  constructor(
    @InjectRepository(CityPage)
    private readonly cityPageRepository: Repository<CityPage>,
  ) {}

  async create(createCityPageDto: CreateCityPageDto): Promise<CityPage> {
    const cityPage = this.cityPageRepository.create(createCityPageDto);
    return await this.cityPageRepository.save(cityPage);
  }

  async findAllPublished(): Promise<CityPage[]> {
    return await this.cityPageRepository.find({
      where: { published: true },
      order: { cityName: 'ASC' },
    });
  }

  async findAll(): Promise<CityPage[]> {
    return await this.cityPageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<CityPage> {
    const cityPage = await this.cityPageRepository.findOne({
      where: { slug, published: true },
    });
    if (!cityPage) {
      throw new NotFoundException(`City page with slug "${slug}" not found`);
    }
    return cityPage;
  }

  async findOne(id: number): Promise<CityPage> {
    const cityPage = await this.cityPageRepository.findOne({
      where: { id },
    });
    if (!cityPage) {
      throw new NotFoundException(`City page with ID ${id} not found`);
    }
    return cityPage;
  }

  async update(id: number, updateCityPageDto: UpdateCityPageDto): Promise<CityPage> {
    const cityPage = await this.findOne(id);
    Object.assign(cityPage, updateCityPageDto);
    return await this.cityPageRepository.save(cityPage);
  }

  async remove(id: number): Promise<void> {
    const cityPage = await this.findOne(id);
    await this.cityPageRepository.remove(cityPage);
  }
}
