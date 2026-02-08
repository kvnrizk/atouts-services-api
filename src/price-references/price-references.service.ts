import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceReference } from './entities/price-reference.entity';
import { CreatePriceReferenceDto } from './dto/create-price-reference.dto';
import { UpdatePriceReferenceDto } from './dto/update-price-reference.dto';

@Injectable()
export class PriceReferencesService {
  constructor(
    @InjectRepository(PriceReference)
    private readonly priceReferenceRepository: Repository<PriceReference>,
  ) {}

  async create(dto: CreatePriceReferenceDto): Promise<PriceReference> {
    const priceRef = this.priceReferenceRepository.create(dto);
    return await this.priceReferenceRepository.save(priceRef);
  }

  async findAllActive(): Promise<PriceReference[]> {
    return await this.priceReferenceRepository.find({
      where: { active: true },
      order: { category: 'ASC', sortOrder: 'ASC', label: 'ASC' },
    });
  }

  async findAll(): Promise<PriceReference[]> {
    return await this.priceReferenceRepository.find({
      order: { category: 'ASC', sortOrder: 'ASC', label: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<PriceReference[]> {
    return await this.priceReferenceRepository.find({
      where: { category, active: true },
      order: { sortOrder: 'ASC', label: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PriceReference> {
    const priceRef = await this.priceReferenceRepository.findOne({
      where: { id },
    });
    if (!priceRef) {
      throw new NotFoundException(`Price reference with ID ${id} not found`);
    }
    return priceRef;
  }

  async update(id: number, dto: UpdatePriceReferenceDto): Promise<PriceReference> {
    const priceRef = await this.findOne(id);
    Object.assign(priceRef, dto);
    return await this.priceReferenceRepository.save(priceRef);
  }

  async remove(id: number): Promise<void> {
    const priceRef = await this.findOne(id);
    await this.priceReferenceRepository.remove(priceRef);
  }
}
