import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockRepository: Record<string, jest.Mock>;

  const mockItem: Partial<Portfolio> = {
    id: 1,
    title: 'Salon moderne',
    description: 'Peinture salon',
    imageUrl: '/uploads/file-123.jpg',
    category: 'peinture',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        { provide: getRepositoryToken(Portfolio), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  describe('create', () => {
    it('should create and return a portfolio item', async () => {
      mockRepository.create.mockReturnValue(mockItem);
      mockRepository.save.mockResolvedValue(mockItem);

      const result = await service.create({
        title: 'Salon moderne',
        imageUrl: '/uploads/file-123.jpg',
        category: 'peinture',
      });

      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return only published items when published=true', async () => {
      mockRepository.find.mockResolvedValue([mockItem]);

      const result = await service.findAll(true);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { published: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockItem]);
    });

    it('should return all items when published is undefined', async () => {
      mockRepository.find.mockResolvedValue([mockItem]);

      await service.findAll(undefined);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a portfolio item by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCategory', () => {
    it('should return published items for a category', async () => {
      mockRepository.find.mockResolvedValue([mockItem]);

      const result = await service.findByCategory('peinture');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { category: 'peinture', published: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockItem]);
    });
  });

  describe('update', () => {
    it('should update and return a portfolio item', async () => {
      const updated = { ...mockItem, title: 'Updated' };
      mockRepository.findOne.mockResolvedValue({ ...mockItem });
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, { title: 'Updated' });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a portfolio item', async () => {
      mockRepository.findOne.mockResolvedValue(mockItem);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockItem);
    });
  });
});
