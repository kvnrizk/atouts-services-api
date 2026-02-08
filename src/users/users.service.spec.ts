import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Record<string, jest.Mock>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@test.fr',
    password: '$2b$10$hashed',
    full_name: 'Test User',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashed');
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create('test@test.fr', 'password', 'Test User', 'admin');

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: 'test@test.fr',
        password: '$2b$10$hashed',
        full_name: 'Test User',
        role: 'admin',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create('test@test.fr', 'password', 'Test', 'admin'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.fr');
      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.fr' } });
    });

    it('should return undefined when not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findByEmail('nope@test.fr');
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('validatePassword', () => {
    it('should return true for matching password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword('plain', 'hashed');
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword('wrong', 'hashed');
      expect(result).toBe(false);
    });
  });
});
