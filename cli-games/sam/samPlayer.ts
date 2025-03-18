import { Card, CardSuit } from "../cards"

abstract class SamAbstractPlayer {
  hand: Card[];

  constructor(hand: Card[]) {
    this.hand = hand
  }

  /// Tới trắng (win without even having to play)
  // Sảnh rồng (10-card flush)
  tenCardFlush(): Boolean {
    this.hand.sort((a, b) => a.getRank - b.getRank);
    for (let i = 1; i < this.hand.length; i++) {
      if (this.hand[i].getRank != this.hand[i - 1].getRank + 1) {
        return false;
      }
    }
    return true;
  }

  // Tứ quý 2 (four of a kind for 2's)
  fourTwos(): Boolean {
    let countTwos: number = 0;
    for (const card of this.hand) {
      if (card.getRank == 2) {
        countTwos++;
      }
    }
    return countTwos == 4
  }

  // Ù màu (all black or red hand)
  allColor(): Boolean {
    let colorDict = {
      black: 0,
      red: 0
    }

    for (const card of this.hand) {
      if (card.getSuit == CardSuit.Spades || card.getSuit == CardSuit.Clubs) {
        colorDict.black++;
      } else {
        colorDict.red++;
      }
    }

    return colorDict.black == 10 || colorDict.red == 10
  }

  // 3 sám (3 collections of three of kind)
  threeThrees() {
    let rankDict = {}
    for (const card of this.hand) {
      const rank = card.getRank;
      if (!rankDict[rank]) {
        rankDict[rank] = 1;        
      } else {
        rankDict[rank]++;
      }
    }

    let threeCount = 0;
    for (const rank in rankDict) {
      if (rankDict[rank] === 3) {
        threeCount++;
      }
    }
    return threeCount === 3;
  }

  // 5 đôi (5 pairs)
  fivePairs() {
    let rankDict = {}
    for (const card of this.hand) {
      const rank = card.getRank;
      if (!rankDict[rank]) {
        rankDict[rank] = 1;        
      } else {
        rankDict[rank]++;
      }
    }

    let pairsCount = 0;
    for (const rank in rankDict) {
      if (rankDict[rank] === 2) {
        pairsCount++;
      }
    }
    return pairsCount === 5;
  }
}

export class SamUserPlayer extends SamAbstractPlayer {
  hello() {
    console.log("hello world");
  }
}