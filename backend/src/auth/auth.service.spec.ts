import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    service.clearCurrentUser();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      mockUserService.login.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
      expect(mockUserService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('setCurrentUser', () => {
    it('should set current user', () => {
      service.setCurrentUser(mockUser);

      const currentUser = service.getCurrentUser();
      expect(currentUser).toEqual(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when set', () => {
      service.setCurrentUser(mockUser);

      const result = service.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is set', () => {
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('clearCurrentUser', () => {
    it('should clear current user', () => {
      service.setCurrentUser(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);

      service.clearCurrentUser();
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
