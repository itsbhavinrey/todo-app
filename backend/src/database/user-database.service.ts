import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { User } from '../user/user.interface';

@Injectable()
export class UserDatabaseService {
  private readonly dbPath = join(process.cwd(), 'data', 'users.json');
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

  private async readUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  private async writeUsers(users: User[]): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(users, null, 2), 'utf-8');
  }

  async findAll(): Promise<User[]> {
    return this.readUsers();
  }

  async findOne(id: number): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find((user) => user.username === username) || null;
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const users = await this.readUsers();
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser: User = {
      id: newId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    await this.writeUsers(users);
    return newUser;
  }

  async update(
    id: number,
    updateData: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null> {
    const users = await this.readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    await this.writeUsers(users);
    return users[userIndex];
  }

  async remove(id: number): Promise<boolean> {
    const users = await this.readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    await this.writeUsers(users);
    return true;
  }
}
