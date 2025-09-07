import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthService } from '../auth/auth.service';
import type { CreateTodoDto, UpdateTodoDto } from './todo.interface';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  private getCurrentUserId(): number {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new UnauthorizedException('Please login first');
    }
    return user.id;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto) {
    const userId = this.getCurrentUserId();
    return this.todoService.create(createTodoDto, userId);
  }

  @Get()
  findAll() {
    const userId = this.getCurrentUserId();
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const userId = this.getCurrentUserId();
    return this.todoService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const userId = this.getCurrentUserId();
    return this.todoService.update(id, updateTodoDto, userId);
  }

  @Patch(':id/toggle')
  toggleComplete(@Param('id', ParseIntPipe) id: number) {
    const userId = this.getCurrentUserId();
    return this.todoService.toggleComplete(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    const userId = this.getCurrentUserId();
    return this.todoService.remove(id, userId);
  }
}
