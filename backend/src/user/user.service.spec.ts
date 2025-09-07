import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDatabaseService } from '../database/user-database.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from './user.interface';

describe('UserService', () => {
  let service: UserService;
  let userDatabase: UserDatabaseService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserDatabase = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserDatabaseService,
          useValue: mockUserDatabase,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userDatabase = module.get<UserDatabaseService>(UserDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUser];
      mockUserDatabase.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('username', 'testuser');
      expect(result[0]).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('findOne', () => {
    it('should return a user without password', async () => {
      mockUserDatabase.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 1);
      expect(mockUserDatabase.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserDatabase.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create a new user', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(null);
      mockUserDatabase.findByUsername.mockResolvedValue(null);
      mockUserDatabase.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(mockUserDatabase.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    });

    it('should throw BadRequestException for missing username', async () => {
      await expect(
        service.create({ ...createUserDto, username: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for short password', async () => {
      await expect(
        service.create({ ...createUserDto, password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid email', async () => {
      await expect(
        service.create({ ...createUserDto, email: 'invalid-email' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for existing email', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException for existing username', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(null);
      mockUserDatabase.findByUsername.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      username: 'updateduser',
    };

    it('should update a user', async () => {
      mockUserDatabase.findOne.mockResolvedValue(mockUser);
      mockUserDatabase.findByUsername.mockResolvedValue(null);
      mockUserDatabase.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.update(1, updateUserDto);

      expect(result).not.toHaveProperty('password');
      expect(mockUserDatabase.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.update(0, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException for existing username', async () => {
      mockUserDatabase.findOne.mockResolvedValue(mockUser);
      mockUserDatabase.findByUsername.mockResolvedValue({ ...mockUser, id: 2 });

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserDatabase.findOne.mockResolvedValue(mockUser);
      mockUserDatabase.remove.mockResolvedValue(true);

      await service.remove(1);

      expect(mockUserDatabase.remove).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.remove(0)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserDatabase.remove.mockResolvedValue(false);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 1);
    });

    it('should throw BadRequestException for missing credentials', async () => {
      await expect(
        service.login({ email: '', password: 'password' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for invalid email', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid password', async () => {
      mockUserDatabase.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login({ ...loginDto, password: 'wrongpassword' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
