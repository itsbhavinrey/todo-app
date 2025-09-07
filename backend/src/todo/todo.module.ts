import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { JsonDatabaseService } from '../database/json-database.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TodoController],
  providers: [TodoService, JsonDatabaseService],
  exports: [TodoService],
})
export class TodoModule {}
