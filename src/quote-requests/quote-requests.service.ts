import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRequest } from './entities/quote-request.entity';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteRequestStatusDto } from './dto/update-quote-request-status.dto';

@Injectable()
export class QuoteRequestsService {
  constructor(
    @InjectRepository(QuoteRequest)
    private readonly quoteRequestRepository: Repository<QuoteRequest>,
  ) {}

  async create(createQuoteRequestDto: CreateQuoteRequestDto): Promise<QuoteRequest> {
    const quoteRequest = this.quoteRequestRepository.create({
      first_name: createQuoteRequestDto.first_name,
      last_name: createQuoteRequestDto.last_name,
      email: createQuoteRequestDto.email,
      phone: createQuoteRequestDto.phone,
      project_type: createQuoteRequestDto.project_type,
      message: createQuoteRequestDto.message,
      status: 'nouveau',
    });

    return await this.quoteRequestRepository.save(quoteRequest);
  }

  async findAll(page = 1, limit = 50): Promise<{ data: QuoteRequest[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.quoteRequestRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<QuoteRequest> {
    const quoteRequest = await this.quoteRequestRepository.findOne({
      where: { id },
    });

    if (!quoteRequest) {
      throw new NotFoundException(`Quote request with ID ${id} not found`);
    }

    return quoteRequest;
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateQuoteRequestStatusDto,
  ): Promise<QuoteRequest> {
    const quoteRequest = await this.findOne(id);
    quoteRequest.status = updateStatusDto.status;
    return await this.quoteRequestRepository.save(quoteRequest);
  }

  async remove(id: number): Promise<void> {
    const quoteRequest = await this.findOne(id);
    await this.quoteRequestRepository.remove(quoteRequest);
  }

  async getStats(): Promise<any> {
    const result = await this.quoteRequestRepository
      .createQueryBuilder('qr')
      .select('qr.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('qr.status')
      .getRawMany();

    const counts: Record<string, number> = {};
    for (const row of result) {
      counts[row.status] = parseInt(row.count, 10);
    }

    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

    return {
      total,
      nouveau: counts['nouveau'] || 0,
      en_cours: counts['en_cours'] || 0,
      traite: counts['traite'] || 0,
    };
  }
}
