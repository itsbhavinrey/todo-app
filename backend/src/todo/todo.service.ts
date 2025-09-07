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

  async findAll(userId: number): Promise<Todo[]> {
    const allTodos = await this.jsonDatabase.findAll();
    return allTodos.filter((todo) => todo.userId === userId);
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const todo = await this.jsonDatabase.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
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
      userId,
      title: createTodoDto.title.trim(),
      description: createTodoDto.description?.trim() || '',
      completed: false,
    };

    return this.jsonDatabase.create(todoData);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<Todo> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    // Check if todo exists and belongs to user
    await this.findOne(id, userId);

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

  async remove(id: number, userId: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    // Check if todo exists and belongs to user
    await this.findOne(id, userId);

    const deleted = await this.jsonDatabase.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  async toggleComplete(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    return this.update(id, { completed: !todo.completed }, userId);
  }
}
