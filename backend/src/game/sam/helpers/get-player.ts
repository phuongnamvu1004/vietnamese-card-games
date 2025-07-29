import { CurrentGameState, Player } from "../../../types/game";

export const getPreviousPlayer = (
  gameState: CurrentGameState,
  currentSocketId: string,
): Player => {
  const idx = gameState.players.findIndex(
    (p) => p.socketId === currentSocketId,
  );
  return gameState.players[(idx + gameState.players.length - 1) % gameState.players.length];
};

export const getNextPlayer = (gameState: CurrentGameState, currentSocketId: string): Player => {
  const idx = gameState.players.findIndex(
    (p) => p.socketId === currentSocketId,
  );
  return gameState.players[(idx + 1) % gameState.players.length];
}