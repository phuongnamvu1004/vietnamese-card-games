import { Card } from "../../shared/cards"

export enum MoveType {
  SINGLE = "single",
  DOUBLE = "double",
  TRIPLET = "triplet",
  QUADRUPLET = "quadruplet",
  STRAIGHT = "straight",
  INVALID = "invalid"
}

export const getMoveType = (cards: Card[]) => {
  // check for single
  if (cards.length === 1) {
    return {
      type: MoveType.SINGLE,
      idCard: cards[0].getRank
    }
  }

  // preprocessing to check for double, triplet and quadruplet
  let cardRankDict: Record<number, number> = {}
  const length = cards.length;

  for (const card of cards) {
    cardRankDict[card.getRank] = (cardRankDict[card.getRank] || 0) + 1;
  }

  // check for double
  if (cardRankDict[cards[0].getRank] === 2 && length === 2) {
    return {
      type: MoveType.DOUBLE,
      idCard: cards[0].getRank
    }
  }

  // check for triplet
  if (cardRankDict[cards[0].getRank] === 3 && length === 3) {
    return {
      type: MoveType.TRIPLET,
      idCard: cards[0].getRank
    }
  }

  // check for quadruplet
  if (cardRankDict[cards[0].getRank] === 4 && length === 4) {
    return {
      type: MoveType.QUADRUPLET,
      idCard: cards[0].getRank
    }
  }

  // check for straight
  if (length >= 3) {
    // get the card ranks out
    const sortedCards = cards
      .map(card => card.getRank)
      .sort((a, b) => b - a);

    if (sortedCards.includes(1) && sortedCards.includes(13)) {
      sortedCards.pop()
      sortedCards.unshift(14);
    }

    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i] !== sortedCards[i - 1] - 1) {
        return {
          type: MoveType.INVALID
        }; // Not a straight
      }
    }
    return {
      type: MoveType.STRAIGHT,
      idCard: sortedCards[0],
      length: length,
    };
  }

  return {
    type: MoveType.INVALID
  };
}

export enum MoveStatus {
  VALID = "valid",
  INVALID = "invalid",
  QUADRUPLET_STOP_TWO = "quadrupletStopTwo"
}

export const validateMove = (previousState: Card[], move: Card[], currentHand: Card[], mustBeat: boolean): MoveStatus => {
  // when at first turn, no cards are played

  const prevMoveType = getMoveType(previousState);
  const curMoveType = getMoveType(move);

  if (prevMoveType.type === MoveType.INVALID || curMoveType.type === MoveType.INVALID) {
    return MoveStatus.INVALID;
  }

  // check if currentHand contains all the cards in move
  const isValidMove = move.every(moveCard =>
    currentHand.some(handCard =>
      handCard.getRank === moveCard.getRank && handCard.getSuit === moveCard.getSuit
    )
  );
  if (!isValidMove) {
    return MoveStatus.INVALID;
  }

  // check for higher straight
  if (prevMoveType.type === MoveType.STRAIGHT && curMoveType.type === MoveType.STRAIGHT) {
    return curMoveType.length! === prevMoveType.length! && curMoveType.idCard! > prevMoveType.idCard! ? MoveStatus.VALID : MoveStatus.INVALID;
  }

  if (prevMoveType.type === curMoveType.type) {
    // check for edge cases where 2 is hit and prevMoveType.type === curMoveType.type (different case than using quadruplet to stop 2)
    if (prevMoveType.idCard === 2) {
      return MoveStatus.INVALID;
    }

    // check for must-beat case (báo còn 1 con): if we are in a single card round and the next person has only one card left => play the highest card available
    if (mustBeat && prevMoveType.type === MoveType.SINGLE && curMoveType.type === MoveType.SINGLE) {
      const ranks = currentHand.map(card => card.getRank);
      if (ranks.includes(2)) {
        return move[0].getRank === 2 ? MoveStatus.VALID : MoveStatus.INVALID;
      }
      if (ranks.includes(1)) {
        return move[0].getRank === 1 ? MoveStatus.VALID : MoveStatus.INVALID;
      }
      return move[0].getRank > prevMoveType.idCard! && move[0].getRank === Math.max(...ranks)
        ? MoveStatus.VALID
        : MoveStatus.INVALID;
    }

    if (prevMoveType.idCard !== 2 && curMoveType.idCard === 2) {
      return MoveStatus.VALID;
    }

    // regular higher rank check for single, double, quadruplet
    return curMoveType.idCard! > prevMoveType.idCard! ? MoveStatus.VALID : MoveStatus.INVALID;
  }

  // check for where using quadruplet to stop 2
  if (prevMoveType.type === MoveType.SINGLE && prevMoveType.idCard! === 2 && curMoveType.type === MoveType.QUADRUPLET) {
    return MoveStatus.QUADRUPLET_STOP_TWO;
  }

  // final case where prevMoveType.type !== curMoveType.type and it is not quadrupletStopTwo
  return MoveStatus.INVALID;
}



