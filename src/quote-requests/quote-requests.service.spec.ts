import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { QuoteRequestsService } from './quote-requests.service';
import { QuoteRequest } from './entities/quote-request.entity';

describe('QuoteRequestsService', () => {
  let service: QuoteRequestsService;
  let mockRepository: Record<string, jest.Mock>;

  const mockQuote: Partial<QuoteRequest> = {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean@test.fr',
    phone: '06 12 34 56 78',
    project_type: 'peinture',
    message: 'Je veux repeindre mon salon',
    status: 'nouveau',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRequestsService,
        { provide: getRepositoryToken(QuoteRequest), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<QuoteRequestsService>(QuoteRequestsService);
  });

  describe('create', () => {
    it('should create a quote request with status nouveau', async () => {
      mockRepository.create.mockReturnValue(mockQuote);
      mockRepository.save.mockResolvedValue(mockQuote);

      const dto = {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@test.fr',
        phone: '06 12 34 56 78',
        project_type: 'peinture',
        message: 'Je veux repeindre mon salon',
      };

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        status: 'nouveau',
      });
      expect(result).toEqual(mockQuote);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockQuote], 1]);

      const result = await service.findAll(1, 50);

      expect(result).toEqual({ data: [mockQuote], total: 1, page: 1, limit: 50 });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 0,
        take: 50,
      });
    });

    it('should calculate correct offset for page 2', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 10,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a quote by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockQuote);

      const result = await service.findOne(1);
      expect(result).toEqual(mockQuote);
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a quote request', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockQuote });
      mockRepository.save.mockResolvedValue({ ...mockQuote, status: 'en_cours' });

      const result = await service.updateStatus(1, { status: 'en_cours' });

      expect(result.status).toBe('en_cours');
    });
  });

  describe('remove', () => {
    it('should remove a quote request', async () => {
      mockRepository.findOne.mockResolvedValue(mockQuote);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockQuote);
    });

    it('should throw NotFoundException for non-existent quote', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return aggregated stats', async () => {
      const mockQb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { status: 'nouveau', count: '5' },
          { status: 'en_cours', count: '3' },
          { status: 'traite', count: '10' },
        ]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 18,
        nouveau: 5,
        en_cours: 3,
        traite: 10,
      });
    });

    it('should return zeros when no data', async () => {
      const mockQb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.getStats();

      expect(result).toEqual({ total: 0, nouveau: 0, en_cours: 0, traite: 0 });
    });
  });
});
