import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccountCleanupService } from './account-cleanup.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AccountCleanupService],
})
export class UsersModule {}
