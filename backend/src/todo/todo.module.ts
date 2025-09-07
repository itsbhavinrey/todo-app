import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { JsonDatabaseService } from '../database/json-database.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, JsonDatabaseService],
  exports: [TodoService],
})
export class TodoModule {}
