import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDatabaseService } from '../database/user-database.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDatabaseService],
  exports: [UserService],
})
export class UserModule {}
