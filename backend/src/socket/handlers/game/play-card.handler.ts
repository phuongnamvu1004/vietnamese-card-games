import { Server, Socket } from "socket.io";
import { Card } from "../../../game/shared/cards";
import { getGameState, updateGameState } from "../../../redis/game-state";
import { playCard } from "../../../game/sam/game-engine";
import { Player } from "../../../types/game";
import { log } from "../../../lib/utils";

export const handlePlayCard = (io: Server, socket: Socket) => {
  return async (card: Card[]) => {
    try {
      const roomId = socket.data.roomId;
      if (!roomId) {
        socket.emit("error", "You are not currently in a game room.");
        return;
      }

      const gameState = await getGameState(roomId);
      if (!gameState) {
        log("Game state not found", "error");
        socket.emit("error", "Game state not found");
        return;
      }

      // Check if it's actually the player's turn
      if (socket.id !== gameState.currentTurn) {
        socket.emit("error", "It's not your turn!");
        return;
      }

      const currentHand = gameState.players.find(
        (player: Player) => player.socketId === socket.id
      )?.hand;

      if (!currentHand) {
        socket.emit("error", "Player's hand not found.");
        return;
      }

      const updatedGameState = playCard(
        gameState,
        socket.id,
        card,
        currentHand,
      );

      if (!updatedGameState) {
        log("Error playing card", "error");
        socket.emit("error", "Invalid move.");
        return;
      }

      // Save updated game state into Redis
      await updateGameState(roomId, updatedGameState);

      if (updatedGameState.phase === "finish") {
        // Notify all players that the game ended
        io.to(roomId).emit("playerWon", {
          winnerId: socket.id, // (could also be generalized later!)
          players: updatedGameState.players,
          finalState: updatedGameState,
        });
      } else {
        // Notify all players about the updated game state
        io.to(roomId).emit("gameStateUpdate", {
          players: updatedGameState.players,
          currentTurn: updatedGameState.currentTurn,
          lastPlayed: updatedGameState.lastPlayed,
          phase: updatedGameState.phase,
        });
      }
    } catch (error) {
      log("Error in playCard handler:", error, "error");
      socket.emit("error", "Unexpected server error during playCard.");
    }
  };
};