import { CurrentGameState, Player } from "../../types/game";
import { Card } from "../shared/cards";
import { log } from "../../lib/utils";
import { MoveStatus, validateMove } from "./rules/validateMove";

export const playCard = (
  gameState: CurrentGameState,
  socketId: string,
  move: Card[],
  currentHand: Card[],
): CurrentGameState | null => {
  // Find the player currently playing
  const player = gameState.players.find((p) => p.socketId === socketId);

  if (!player) {
    log("Invalid player or card", "error");
    throw new Error("Invalid player or card");
  }

  // 1. Validate move
  const lastPlayed = gameState.lastPlayed || null;

  if (validateMove(lastPlayed?.cards, move, currentHand, player.mustBeat) === MoveStatus.INVALID)
    throw new Error("Invalid move");

  // 2. Apply move
  // Remove played cards from player's hand
  for (const card of move) {
    player.hand = player.hand.filter((c) => !c.equals(card));
  }

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
  return gameState.players[
  (idx + gameState.players.length - 1) % gameState.players.length
    ];
};
