export enum CardSuit {
  Hearts = "heart",
  Diamonds = "diamonds",
  Clubs = "clubs",
  Spades = "spades"
}

export class Card {
  private rank: number;
  private suit: CardSuit;

  constructor(rank: number, suit: CardSuit) {
    this.rank = rank;
    this.suit = suit;
  }

  get getCard() {
    return {
      rank: this.rank,
      suit: this.suit
    };
  }

  get getRank() {
    return this.rank
  }

  get getSuit() {
    return this.suit
  }
}

export abstract class Deck {
  private cards: Card[];

  constructor() {
    this.cards = []

    for (let i: number = 1; i <= 13; i++) {
      for (const suit of Object.values(CardSuit).filter(value => typeof value !== 'number')) {
        const newCard = new Card(i, suit as CardSuit);
        this.cards.push(newCard);
      }
    }
  }

  get getCards(): Card[] {
    return this.cards;
  }

  // Fisher-Yates (or Knuth) shuffle algorithm
  shuffleCards(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Drawing card from the top-most position in current deck
  drawCard(hand: Card[]): void | Error {
    if (this.cards.length === 0) {
      throw new Error("No more cards in the deck");
    }
    hand.push(this.cards.pop()!);
  }

  // Initialize hands for a specific games
  abstract initializeHand(numHand: number): Card[][];
}



