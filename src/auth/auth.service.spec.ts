import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser = {
    id: 1,
    email: 'admin@test.fr',
    password: '$2b$10$hashedpassword',
    full_name: 'Admin Test',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return access token', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'admin@test.fr',
        password: 'password123',
        full_name: 'Admin Test',
      });

      expect(usersService.create).toHaveBeenCalledWith(
        'admin@test.fr',
        'password123',
        'Admin Test',
        'admin',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'admin@test.fr',
          full_name: 'Admin Test',
          role: 'admin',
        },
      });
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(true);

      const result = await authService.login({
        email: 'admin@test.fr',
        password: 'password123',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('admin@test.fr');
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'unknown@test.fr', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(false);

      await expect(
        authService.login({ email: 'admin@test.fr', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user by id', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await authService.validateUser(1);
      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith(1);
    });
  });
});
