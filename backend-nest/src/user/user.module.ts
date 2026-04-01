import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserStatisticsRepository } from './user-statistics.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserStatisticsRepository],
  exports: [UserService, UserRepository, UserStatisticsRepository],
})
export class UserModule {}
