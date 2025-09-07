import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JsonDatabaseService } from '../database/json-database.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.interface';

describe('TodoService', () => {
  let service: TodoService;
  let jsonDatabase: JsonDatabaseService;

  const mockTodo = {
    id: 1,
    userId: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJsonDatabase = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: JsonDatabaseService,
          useValue: mockJsonDatabase,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    jsonDatabase = module.get<JsonDatabaseService>(JsonDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return todos for specific user', async () => {
      const allTodos = [
        { ...mockTodo, id: 1, userId: 1 },
        { ...mockTodo, id: 2, userId: 2 },
        { ...mockTodo, id: 3, userId: 1 },
      ];
      mockJsonDatabase.findAll.mockResolvedValue(allTodos);

      const result = await service.findAll(1);

      expect(result).toHaveLength(2);
      expect(result.every((todo) => todo.userId === 1)).toBe(true);
      expect(mockJsonDatabase.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no todos for user', async () => {
      mockJsonDatabase.findAll.mockResolvedValue([]);

      const result = await service.findAll(1);

      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return todo for specific user', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockTodo);
      expect(mockJsonDatabase.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne(0, 1)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(-1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when todo belongs to different user', async () => {
      mockJsonDatabase.findOne.mockResolvedValue({ ...mockTodo, userId: 2 });

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createTodoDto: CreateTodoDto = {
      title: 'New Todo',
      description: 'New Description',
    };

    it('should create a new todo for user', async () => {
      mockJsonDatabase.create.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto, 1);

      expect(result).toEqual(mockTodo);
      expect(mockJsonDatabase.create).toHaveBeenCalledWith({
        userId: 1,
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      });
    });

    it('should throw BadRequestException for missing title', async () => {
      await expect(
        service.create({ ...createTodoDto, title: '' }, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for title too long', async () => {
      const longTitle = 'a'.repeat(201);
      await expect(
        service.create({ ...createTodoDto, title: longTitle }, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for description too long', async () => {
      const longDescription = 'a'.repeat(1001);
      await expect(
        service.create({ ...createTodoDto, description: longDescription }, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      completed: true,
    };

    it('should update todo for specific user', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);
      mockJsonDatabase.update.mockResolvedValue({
        ...mockTodo,
        ...updateTodoDto,
      });

      const result = await service.update(1, updateTodoDto, 1);

      expect(result).toEqual({ ...mockTodo, ...updateTodoDto });
      expect(mockJsonDatabase.update).toHaveBeenCalledWith(1, updateTodoDto);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.update(0, updateTodoDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for empty title', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);

      await expect(service.update(1, { title: '' }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for title too long', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);
      const longTitle = 'a'.repeat(201);

      await expect(service.update(1, { title: longTitle }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove todo for specific user', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);
      mockJsonDatabase.remove.mockResolvedValue(true);

      await service.remove(1, 1);

      expect(mockJsonDatabase.remove).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.remove(0, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle completion status', async () => {
      mockJsonDatabase.findOne.mockResolvedValue(mockTodo);
      mockJsonDatabase.update.mockResolvedValue({
        ...mockTodo,
        completed: true,
      });

      const result = await service.toggleComplete(1, 1);

      expect(result.completed).toBe(true);
      expect(mockJsonDatabase.update).toHaveBeenCalledWith(1, {
        completed: true,
      });
    });

    it('should toggle from completed to incomplete', async () => {
      const completedTodo = { ...mockTodo, completed: true };
      mockJsonDatabase.findOne.mockResolvedValue(completedTodo);
      mockJsonDatabase.update.mockResolvedValue({
        ...completedTodo,
        completed: false,
      });

      const result = await service.toggleComplete(1, 1);

      expect(result.completed).toBe(false);
      expect(mockJsonDatabase.update).toHaveBeenCalledWith(1, {
        completed: false,
      });
    });
  });
});
