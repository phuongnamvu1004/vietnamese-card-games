import { CurrentGameState, Player } from "../../types/game";
import { Card } from "../shared/cards";
import { log } from "../../lib/utils";
import { MoveStatus, validateMove } from "./rules/validateMove";

/**
 * Plays a card in the game.
 *
 * What this method does is basically taking in the current game state, update it then return it back to be updated on Redis database:
 * 1. Validate the move.
 * 2. Apply the move.
 * 3. Check if the player has won.
 * 4. Update the game state.
 *
 * @param gameState Current game state.
 * @param socketId ID of the player making the move.
 * @param move Cards being played.
 * @param pass Boolean indicating if the player is passing (not playing).
 * @returns Description of the return value.
 */
export const playCard = (
  gameState: CurrentGameState,
  socketId: string,
  move: Card[],
  pass: boolean,
): CurrentGameState | null => {
  if (pass) {
    gameState.currentTurn = getNextPlayer(gameState, socketId).socketId;

  }
  // Find the player currently playing
  const player = gameState.players.find((p) => p.socketId === socketId);

  if (!player) {
    log("Invalid player", "error");
    throw new Error("Invalid player");
  }

  const currentHand = player.hand;

  // 1. Validate move
  const lastPlayed = gameState.lastPlayed || null;

  if (validateMove(lastPlayed?.cards, move, currentHand, player.mustBeat) === MoveStatus.INVALID)
    throw new Error("Invalid move");

  // 2. Apply move
  // Remove played cards from player's hand
  for (const card of move) {
    player.hand = player.hand.filter((c) => !c.equals(card));
  }

  // Update currentTurn to the next player -> if there is no player that can defend, the currentTurn will go around and go back to current player
  gameState.currentTurn = getNextPlayer(gameState, socketId).socketId;

  // Update last played cards
  gameState.lastPlayed = {socketId: socketId, cards: move};
  // Update pile (played cards)
  gameState.pile.push(...move);

  // If the current hand has only one card left, set mustBeat to true for the previous player
  if (player.hand.length === 1) {
    const previousPlayer = getPreviousPlayer(gameState, socketId);
    previousPlayer!.mustBeat = true;
  }

  // 3. Check win
  if (player.hand.length === 0) {
    gameState.phase = "finish";
    log(`Player ${socketId} wins!`, "info");
  }

  return gameState;
};

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