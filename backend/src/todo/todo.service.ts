import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../database/json-database.service';
import { Todo, CreateTodoDto, UpdateTodoDto } from './todo.interface';

@Injectable()
export class TodoService {
  constructor(private readonly jsonDatabase: JsonDatabaseService) {}

  async findAll(): Promise<Todo[]> {
    return this.jsonDatabase.findAll();
  }

  async findOne(id: number): Promise<Todo> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const todo = await this.jsonDatabase.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    if (!createTodoDto.title || createTodoDto.title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }

    if (createTodoDto.title.length > 200) {
      throw new BadRequestException('Title must be less than 200 characters');
    }

    if (createTodoDto.description && createTodoDto.description.length > 1000) {
      throw new BadRequestException(
        'Description must be less than 1000 characters',
      );
    }

    const todoData = {
      title: createTodoDto.title.trim(),
      description: createTodoDto.description?.trim() || '',
      completed: false,
    };

    return this.jsonDatabase.create(todoData);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    // Check if todo exists
    await this.findOne(id);

    const updateData: Partial<Todo> = {};

    if (updateTodoDto.title !== undefined) {
      if (!updateTodoDto.title || updateTodoDto.title.trim().length === 0) {
        throw new BadRequestException('Title cannot be empty');
      }
      if (updateTodoDto.title.length > 200) {
        throw new BadRequestException('Title must be less than 200 characters');
      }
      updateData.title = updateTodoDto.title.trim();
    }

    if (updateTodoDto.description !== undefined) {
      if (
        updateTodoDto.description &&
        updateTodoDto.description.length > 1000
      ) {
        throw new BadRequestException(
          'Description must be less than 1000 characters',
        );
      }
      updateData.description = updateTodoDto.description?.trim() || '';
    }

    if (updateTodoDto.completed !== undefined) {
      updateData.completed = Boolean(updateTodoDto.completed);
    }

    const updatedTodo = await this.jsonDatabase.update(id, updateData);
    if (!updatedTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const deleted = await this.jsonDatabase.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  async toggleComplete(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    return this.update(id, { completed: !todo.completed });
  }
}
