import redisClient from "./redis"

import { CurrentGameState } from "../types/game"

export const getGameState = async (roomId: string) => {
  const gameState = await redisClient.get(`gameState:${roomId}`);

  if (!gameState) {
    return null;
  }

  return JSON.parse(gameState);
}

export const updateGameState = async (roomId: string, gameState: CurrentGameState) => {
  // This function should update the game state in Redis
  // For example, using ioredis:
  await redisClient.set(`gameState:${roomId}`, JSON.stringify(gameState));
}