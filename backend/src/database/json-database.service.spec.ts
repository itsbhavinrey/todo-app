import { Test, TestingModule } from '@nestjs/testing';
import { promises as fs } from 'fs';
import { JsonDatabaseService } from './json-database.service';
import { Todo } from '../todo/todo.interface';

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('JsonDatabaseService', () => {
  let service: JsonDatabaseService;
  const mockFs = fs as jest.Mocked<typeof fs>;

  const mockTodo: Todo = {
    id: 1,
    userId: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonDatabaseService],
    }).compile();

    service = module.get<JsonDatabaseService>(JsonDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all todos from file', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });
      expect(mockFs.readFile).toHaveBeenCalled();
    });

    it('should return empty array when file does not exist', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return todo with matching ID', async () => {
      const todos = [mockTodo, { ...mockTodo, id: 2 }];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));

      const result = await service.findOne(1);

      expect(result).toMatchObject({
        id: 1,
        userId: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });
    });

    it('should return null when todo not found', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new todo with auto-increment ID', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));
      mockFs.writeFile.mockResolvedValue();

      const todoData = {
        userId: 1,
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      };

      const result = await service.create(todoData);

      expect(result.id).toBe(2);
      expect(result.title).toBe('New Todo');
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should create first todo with ID 1', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue();

      const todoData = {
        userId: 1,
        title: 'First Todo',
        description: 'First Description',
        completed: false,
      };

      const result = await service.create(todoData);

      expect(result.id).toBe(1);
      expect(result.title).toBe('First Todo');
    });
  });

  describe('update', () => {
    it('should update existing todo', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));
      mockFs.writeFile.mockResolvedValue();

      const updateData = { title: 'Updated Todo' };
      const result = await service.update(1, updateData);

      expect(result?.title).toBe('Updated Todo');
      expect(result?.updatedAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should return null when todo not found', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));

      const result = await service.update(999, { title: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove existing todo', async () => {
      const todos = [mockTodo, { ...mockTodo, id: 2 }];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));
      mockFs.writeFile.mockResolvedValue();

      const result = await service.remove(1);

      expect(result).toBe(true);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should return false when todo not found', async () => {
      const todos = [mockTodo];
      mockFs.readFile.mockResolvedValue(JSON.stringify(todos));

      const result = await service.remove(999);

      expect(result).toBe(false);
    });
  });
});
