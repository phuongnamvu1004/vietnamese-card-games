import redisClient from "./redis";
import { CurrentGameState } from "../types/game";

const getGameStateKey = (roomId: string) => `gameState:${roomId}`;

// Get current game state
export const getGameState = async (roomId: string) => {
  const gameState = await redisClient.get(getGameStateKey(roomId));
  return gameState ? JSON.parse(gameState) : null;
};

// Update (or create) game state
export const updateGameState = async (
  roomId: string,
  gameState: CurrentGameState,
) => {
  await redisClient.set(getGameStateKey(roomId), JSON.stringify(gameState));
};

// ✅ Create game state (optional wrapper for clarity)
export const createGameState = async (
  roomId: string,
  gameState: CurrentGameState,
) => {
  // Prevent overwriting if game already exists (optional safety)
  const existing = await getGameState(roomId);
  if (existing) {
    throw new Error("Game state already exists");
  }

  await redisClient.set(getGameStateKey(roomId), JSON.stringify(gameState));
};

// ✅ Delete game state (e.g., when game ends or all players leave)
export const deleteGameState = async (roomId: string) => {
  await redisClient.del(getGameStateKey(roomId));
};
