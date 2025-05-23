import { Server, Socket } from "socket.io";
import { getGameState, updateGameState } from "../../../redis/gameState";
import { log, toError } from "../../../lib/utils";
import { Card, dealCards, shuffleDeck } from "../../../game/shared/cards";
import { CurrentGameState } from "../../../types/game";

/**
 * @function handleStartGame
 * @description
 * Socket.io handler invoked when the host clicks "Start Game" after all players have joined.
 *
 * Responsibilities:
 * - Validates the current player count.
 * - Generates and shuffles a full deck of cards.
 * - Deals hands to each player based on game type.
 * - Assigns hands and determines the first turn (host starts by default).
 * - Updates the `gameState` in Redis with deck, hands, and current turn.
 * - Emits the `gameStarted` event to all clients in the room with the updated game state.
 *
 * This function ensures consistent and centralized game initialization
 * and should only be called by the host after all players are ready.
 *
 * @param {Server} io - The Socket.io server instance
 * @param {Socket} socket - The host's socket instance; must have `roomId` in `socket.data`
 *
 * @returns {Function} - An async handler function that triggers the game start logic,
 *                      and responds with a callback:
 *                      - `{ success: true }` on success
 *                      - `{ error: string }` if the game cannot be started
 */
export const handleStartGame = (io: Server, socket: Socket) => {
  return async (
    callback: (response: { success?: boolean; error?: string }) => void
  ) => {
    try {
      const roomId: string = socket.data.roomId;

      // Fetch current game state from Redis
      let gameState: CurrentGameState = await getGameState(roomId);
      if (!gameState) {
        callback({ error: "Game state not found or expired." });
        return;
      }

      const players = gameState.players;
      const numPlayers = players.length;

      if (numPlayers < 2) {
        callback({ error: "At least 2 players are required to start the game." });
        return;
      }

      // Create and shuffle deck
      const deck = shuffleDeck(Card.createDeck());
      const hands = dealCards(deck, numPlayers, gameState.gameType);

      if (hands.length !== numPlayers) {
        callback({ error: "Card dealing failed due to hand mismatch." });
        return;
      }

      // Assign hands and determine the first turn (host starts)
      let currentTurnSocketId: string | undefined;
      let handIndex = 0;

      for (const player of players) {
        if (player.socketId === socket.id) {
          currentTurnSocketId = player.socketId;
          player.hand = hands[0]; // Host gets first hand
        } else {
          handIndex++;
          player.hand = hands[handIndex];
        }
      }

      // Update game state
      gameState = {
        ...gameState,
        players,
        deck,
        currentTurn: currentTurnSocketId!,
      };

      await updateGameState(roomId, gameState);

      // Notify all players
      io.to(roomId).emit("gameStarted", gameState);
      callback({ success: true });
    } catch (error: unknown) {
      const err = toError(error);
      log("startGame error", err.message, "error");
      callback({ error: err.message || "Internal server error" });
    }
  };
};