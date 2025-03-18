import { Card, Deck } from "../cards"

export class SamDeck extends Deck {
  initializeHand(numHand: number): Card[][] {
    if (numHand < 2 && numHand >= 5) {
      throw new Error("invalid number of hands")
    }

    this.shuffleCards()
    const result: Card[][] = [];
    for (let i = 0; i < numHand; i++) {
      let curHand = [];
      for (let j = 0; j < 10; j++) {
        this.drawCard(curHand);
      }
      result.push(curHand)
    }
    return result;
  }
}
