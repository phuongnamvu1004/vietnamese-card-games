import { CurrentGameState, Player } from "../../../types/game";

export const calculateTransaction = (currentGameState: CurrentGameState, otherPlayers: Player[], wonPlayer: Player, valuePerCard: number): void => {
  let total = 0;

  for (const player of otherPlayers) {
    if (player.socketId !== wonPlayer.socketId) {
      const transaction = calculateTransactionPerPlayer(player, valuePerCard);
      total += transaction;
    }
  }

  // Apply the changes to the game state
  currentGameState.players = currentGameState.players.map((player) => {
    if (player.socketId === wonPlayer.socketId) {
      return {...player, gameBalance: player.gameBalance + total};
    }
    return player;
  });
};

export const calculateTransactionPerPlayer = (player: Player, valuePerCard: number): number => {
  const hand = player.hand;
  const cardCounter: Record<number, number> = {};

  for (const card of hand) {
    cardCounter[card.getRank] = (cardCounter[card.getRank] || 0) + 1;
  }

  const numberOfTwos = cardCounter[2] || 0;
  const numberOfCards = hand.length;

  // Case 1: Four of a kind
  if (Object.values(cardCounter).includes(4)) {
    return deduct(player, valuePerCard * 30);
  }

  // Case 2: Burnt (10 cards left)
  if (numberOfCards === 10) {
    return deduct(player, valuePerCard * 20 + numberOfTwos * valuePerCard);
  }

  // Case 3: Normal hand
  return deduct(player, numberOfCards * valuePerCard + numberOfTwos * valuePerCard);
};

const deduct = (player: Player, amount: number): number => {
  const loss = Math.min(player.gameBalance, amount);
  player.gameBalance -= loss;
  return loss;
};
