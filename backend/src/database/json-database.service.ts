import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Todo } from '../todo/todo.interface';

@Injectable()
export class JsonDatabaseService {
  private readonly dbPath = join(process.cwd(), 'data', 'todos.json');
  private readonly dataDir = join(process.cwd(), 'data');

  constructor() {
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async readTodos(): Promise<Todo[]> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  private async writeTodos(todos: Todo[]): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(todos, null, 2), 'utf-8');
  }

  async findAll(): Promise<Todo[]> {
    return this.readTodos();
  }

  async findOne(id: number): Promise<Todo | null> {
    const todos = await this.readTodos();
    return todos.find((todo) => todo.id === id) || null;
  }

  async create(
    todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Todo> {
    const todos = await this.readTodos();
    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

    const newTodo: Todo = {
      id: newId,
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    todos.push(newTodo);
    await this.writeTodos(todos);
    return newTodo;
  }

  async update(
    id: number,
    updateData: Partial<Omit<Todo, 'id' | 'createdAt'>>,
  ): Promise<Todo | null> {
    const todos = await this.readTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return null;
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    await this.writeTodos(todos);
    return todos[todoIndex];
  }

  async remove(id: number): Promise<boolean> {
    const todos = await this.readTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return false;
    }

    todos.splice(todoIndex, 1);
    await this.writeTodos(todos);
    return true;
  }
}
