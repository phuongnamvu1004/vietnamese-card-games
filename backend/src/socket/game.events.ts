import { Server, Socket } from "socket.io";
import { Card } from "../game/shared/cards";
import { playCard } from "../game/sam/gameEngine";
import { getGameState } from "../redis/gameState";
import { log } from "../lib/utils";
import { Player } from "../types/game";

export const setupGameEvents = (io: Server, socket: Socket): void => {
  socket.on("playCard", async (roomId: string, card: Card[]) => {
    try {
      const gameState = await getGameState(roomId);
      if (!gameState) {
        log("Game state not found", "error");
        socket.emit("error", "Game state not found");
        return;
      }

      // Get current hand from player with this socket.id
      const currentHand = gameState.players.find((player: Player) => player.socketId === socket.id)?.hand;

      // Play the card and get the updated GameState
      const updatedGameState = playCard(gameState, socket.id, card, currentHand)

      if (!updatedGameState) {
        log("Error playing card", "error");
        socket.emit("error", "Error playing card");
        return;
      }

      if (updatedGameState.phase === "finish") {
        // Notify all clients who won
        io.to(roomId).emit("playerWon", {
          winnerId: socket.id,
          players: updatedGameState.players,
          finalState: updatedGameState,
        });

        // TODO: Handle money logic (e.g., call calculateAndTransfer(roomId, updatedGameState))

      }

    } catch (error) {
      log("Error playing card:", error, "error");
      socket.emit("error", "Error playing card");
      return;
    }
  })
};

