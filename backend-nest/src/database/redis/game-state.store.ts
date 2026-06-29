import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

type GameState = Record<string, unknown>;

@Injectable()
export class GameStateStore {
  constructor(private readonly redisService: RedisService) {}

  private getGameStateKey(roomId: string): string {
    return `gameState:${roomId}`;
  }

  async createGameState(roomId: string, gameState: GameState): Promise<void> {
    const existing = await this.getGameState(roomId);
    if (existing) {
      throw new Error('Game state already exists');
    }

    await this.redisService
      .getClient()
      .set(this.getGameStateKey(roomId), JSON.stringify(gameState));
  }

  async getGameState<T = GameState>(roomId: string): Promise<T | null> {
    const gameState = await this.redisService
      .getClient()
      .get(this.getGameStateKey(roomId));

    return gameState ? (JSON.parse(gameState) as T) : null;
  }

  async updateGameState(roomId: string, gameState: GameState): Promise<void> {
    await this.redisService
      .getClient()
      .set(this.getGameStateKey(roomId), JSON.stringify(gameState));
  }

  async deleteGameState(roomId: string): Promise<void> {
    await this.redisService.getClient().del(this.getGameStateKey(roomId));
  }
}
