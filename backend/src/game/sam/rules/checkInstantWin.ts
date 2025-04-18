import { Card, Suit } from "../../shared/cards";

export enum InstantWinType {
  DragonStraight = "dragonStraight",
  FourTwos = "fourTwo",
  FlushHand = "flushHand",
  ThreeTriplets = "threeTriplets",
  FivePairs = "fivePairs",
  None = "none",
}

// Check for instant wins in the correct order: Dragon Straight > Four Twos > Flush Hand > Three Triplets >  Five Pairs
export const checkInstantWin = (cards: Card[]) => {
  // check dragon straight
  const sortedCards = cards
    .map(card => card.getRank)
    .sort((a, b) => b - a);

  if (sortedCards.includes(1) && sortedCards.includes(13)) {
    sortedCards.pop();
    sortedCards.unshift(14);
  }

  const isDragonStraight = () => {
    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i] !== sortedCards[i - 1] - 1) {
        return false;
      }
    }
    return true;
  }

  if (isDragonStraight()) {
    return InstantWinType.DragonStraight;
  }

  // To check for the collection types: fourTwos, threeTriplets, fivePairs => construct a dictionary
  const cardRankDict: Record<number, number> = {}

  for (const card of cards) {
    cardRankDict[card.getRank] = (cardRankDict[card.getRank] || 0) + 1;
  }

  // check four twos
  if (cardRankDict[2] && cardRankDict[2] === 4) {
    return InstantWinType.FourTwos;
  }

  // check flush hand (in the middle of collection types to keep the priority in order)
  const suits = cards.map(card => card.getSuit)

  const isFlush = () => {
    const blackSuits = [Suit.Spade, Suit.Club];
    const redSuits = [Suit.Diamond, Suit.Heart];

    const isAllBlack = suits.every(suit => blackSuits.includes(suit));
    const isAllRed = suits.every(suit => redSuits.includes(suit));

    return isAllBlack || isAllRed;
  }

  if (isFlush()) {
    return InstantWinType.FlushHand;
  }

  // check three triplets
  const isThreeTriplets = () => {
    let countTriplets = 0;

    for (const rank of Object.keys(cardRankDict).map(Number)) {
      if (cardRankDict[rank] === 3) {
        countTriplets++;
      }
    }

    return countTriplets === 3;
  };

  if (isThreeTriplets()) {
    return InstantWinType.ThreeTriplets;
  }

  // check five pairs
  const isFivePairs = () => {
    let countTwos = 0;

    for (const rank of Object.keys(cardRankDict).map(Number)) {
      if (cardRankDict[rank] === 2) {
        countTwos += 1;
      }
    }

    return countTwos === 5;
  }

  if (isFivePairs()) {
    return InstantWinType.FivePairs;
  }

  return InstantWinType.None;
}