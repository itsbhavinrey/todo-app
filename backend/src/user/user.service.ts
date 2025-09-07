import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserDatabaseService } from '../database/user-database.service';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  UserResponse,
} from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userDatabase: UserDatabaseService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userDatabase.findAll();
    return users.map(this.toUserResponse);
  }

  async findOne(id: number): Promise<UserResponse> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userDatabase.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toUserResponse(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Validate input
    if (!createUserDto.username || createUserDto.username.trim().length === 0) {
      throw new BadRequestException('Username is required');
    }

    if (!createUserDto.email || createUserDto.email.trim().length === 0) {
      throw new BadRequestException('Email is required');
    }

    if (!createUserDto.password || createUserDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userDatabase.findByEmail(
      createUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUserByUsername = await this.userDatabase.findByUsername(
      createUserDto.username,
    );
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const userData = {
      username: createUserDto.username.trim(),
      email: createUserDto.email.trim().toLowerCase(),
      password: createUserDto.password, // In production, hash this password
    };

    const newUser = await this.userDatabase.create(userData);
    return this.toUserResponse(newUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    // Check if user exists
    await this.findOne(id);

    const updateData: Partial<User> = {};

    if (updateUserDto.username !== undefined) {
      if (
        !updateUserDto.username ||
        updateUserDto.username.trim().length === 0
      ) {
        throw new BadRequestException('Username cannot be empty');
      }

      // Check if username already exists (excluding current user)
      const existingUser = await this.userDatabase.findByUsername(
        updateUserDto.username,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username already exists');
      }
      updateData.username = updateUserDto.username.trim();
    }

    if (updateUserDto.email !== undefined) {
      if (!updateUserDto.email || updateUserDto.email.trim().length === 0) {
        throw new BadRequestException('Email cannot be empty');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateUserDto.email)) {
        throw new BadRequestException('Invalid email format');
      }

      // Check if email already exists (excluding current user)
      const existingUser = await this.userDatabase.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
      updateData.email = updateUserDto.email.trim().toLowerCase();
    }

    if (updateUserDto.password !== undefined) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      updateData.password = updateUserDto.password; // In production, hash this password
    }

    const updatedUser = await this.userDatabase.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.toUserResponse(updatedUser);
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    const deleted = await this.userDatabase.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async login(loginDto: LoginDto): Promise<UserResponse> {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userDatabase.findByEmail(
      loginDto.email.toLowerCase(),
    );
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    // In production, compare hashed passwords
    if (user.password !== loginDto.password) {
      throw new NotFoundException('Invalid email or password');
    }

    return this.toUserResponse(user);
  }

  private toUserResponse(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}
