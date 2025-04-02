import { CurrentGameState, Player } from '../../types/game';
// import { validatePlay, isWinningMove } from './rules';

export function playCard(gameState: CurrentGameState, playerId: string, card: string): CurrentGameState | null {
  // const player = gameState.players.find(p => p.id === playerId);
  // if (!player || !player.hand.includes(card)) throw new Error('Invalid player or card');

  // // 1. Validate move
  // const lastPlayed = gameState.lastPlayed || null;
  // if (!validatePlay(card, lastPlayed)) throw new Error('Invalid move');

  // // 2. Apply move
  // player.hand = player.hand.filter(c => c !== card);
  // gameState.lastPlayed = { playerId, card };
  // gameState.currentTurn = getNextPlayerId(gameState, playerId);

  // // 3. Check win
  // if (isWinningMove(player)) {
  //   gameState.phase = 'finish';
  //   gameState.winner = playerId;
  // }

  // return gameState;
  return null;
}

function getNextPlayerId(gameState: CurrentGameState, currentId: string): string {
  // const idx = gameState.players.findIndex(p => p.id === currentId);
  // return gameState.players[(idx + 1) % gameState.players.length].id;
  return ""
}
