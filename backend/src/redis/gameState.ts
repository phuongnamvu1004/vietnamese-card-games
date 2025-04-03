import type { Player } from '../types/game';

import redisClient from "./redis"

export const getGameState = async (roomId: string) => {
  const gameState = await redisClient.get(`gameState:${roomId}`);

  if (!gameState) {
    return null;
  }

  return JSON.parse(gameState);
}

export const updateGameState = async (roomId: string, gameState: any, playerList: Player[]) => {
  // This function should update the game state in Redis
  // For example, using ioredis:
  await redisClient.set(`gameState:${roomId}`, JSON.stringify(gameState));
}