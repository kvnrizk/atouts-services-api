import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BeforeAfterService } from './before-after.service';
import { BeforeAfter } from './entities/before-after.entity';

describe('BeforeAfterService', () => {
  let service: BeforeAfterService;
  let mockRepository: Record<string, jest.Mock>;

  const mockProject: Partial<BeforeAfter> = {
    id: 1,
    title: 'Salle de bain Issy',
    description: 'Renovation complete',
    beforeImageUrl: '/uploads/before-123.jpg',
    afterImageUrl: '/uploads/after-123.jpg',
    category: 'salles-de-bains',
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
        BeforeAfterService,
        { provide: getRepositoryToken(BeforeAfter), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BeforeAfterService>(BeforeAfterService);
  });

  describe('create', () => {
    it('should create and return a before/after project', async () => {
      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create({
        title: 'Salle de bain Issy',
        beforeImageUrl: '/uploads/before-123.jpg',
        afterImageUrl: '/uploads/after-123.jpg',
        category: 'salles-de-bains',
      });

      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return published items when published=true', async () => {
      mockRepository.find.mockResolvedValue([mockProject]);

      const result = await service.findAll(true);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { published: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockProject]);
    });

    it('should return all items when published is undefined', async () => {
      mockRepository.find.mockResolvedValue([mockProject]);

      await service.findAll(undefined);

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByCategory', () => {
    it('should return published items for a category', async () => {
      mockRepository.find.mockResolvedValue([mockProject]);

      const result = await service.findByCategory('salles-de-bains');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { category: 'salles-de-bains', published: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a project', async () => {
      const updated = { ...mockProject, title: 'Updated' };
      mockRepository.findOne.mockResolvedValue({ ...mockProject });
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, { title: 'Updated' });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockProject);
    });

    it('should throw NotFoundException for non-existent project', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
