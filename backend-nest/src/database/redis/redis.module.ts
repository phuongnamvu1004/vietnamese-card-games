import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameStateStore } from './game-state.store';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, GameStateStore],
  exports: [RedisService, GameStateStore],
})
export class RedisModule {}
