import { CurrentGameState } from '../../types/game';
import { Card } from "../shared/cards";
import { log } from "../../lib/utils";
import { validateMove } from "./rules/validateMove";

export function playCard(gameState: CurrentGameState, playerId: string, move: Card[], currentHand: Card[]): CurrentGameState | null {
  // Find the player currently playing
  const player = gameState.players.find(p => p.id === playerId);

  if (!player || !move.every(card => player.hand.includes(card))) {
    log("Invalid player or card", "error")
    throw new Error('Invalid player or card');
  }

  // 1. Validate move
  const lastPlayed = gameState.lastPlayed || null;

  if (!validateMove(lastPlayed?.cards, move, currentHand, player.mustBeat)) throw new Error('Invalid move');

  // 2. Apply move
  for (const card of move) {
    player.hand = player.hand.filter(c => c !== card);
  }

  gameState.lastPlayed = {playerId: playerId, cards: move};
  const nextPlayerId = getNextPlayerId(gameState, playerId);

  if (player.hand.length === 1) {
    const nextPlayer = gameState.players.find(p => p.id === nextPlayerId);
    nextPlayer!.mustBeat = true;
  }

  // 3. Check win
  if (player.hand.length === 0) {
    gameState.phase = "finish";
    log(`Player ${playerId} wins!`, "info");
  }

  return gameState;
}

function getNextPlayerId(gameState: CurrentGameState, currentId: string): string {
  const idx = gameState.players.findIndex(p => p.id === currentId);
  return gameState.players[(idx + 1) % gameState.players.length].id;
}
