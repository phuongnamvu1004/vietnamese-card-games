export enum Suit {
  Spade = "spade",
  Club = "club",
  Diamond = "diamond",
  Heart = "heart",
}

export class Card {
  constructor(
    private suit: Suit,
    private rank: number,
  ) {}

  get getRank(): number {
    return this.rank;
  }

  get getSuit(): Suit {
    return this.suit;
  }

  equals(other: Card): boolean {
    return this.rank === other.getRank && this.suit === other.getSuit;
  }

  toString(): string {
    const rankStr = Card.rankToString(this.rank);
    return `${rankStr} of ${this.suit}`;
  }

  static rankToString(rank: number): string {
    const faceCards: Record<number, string> = {
      1: "A",
      11: "J",
      12: "Q",
      13: "K",
    };
    return faceCards[rank] || rank.toString();
  }

  static createDeck(): Card[] {
    const suits = Object.values(Suit);
    const deck: Card[] = [];

    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push(new Card(suit, rank));
      }
    }

    return deck;
  }
}

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (
  deck: Card[],
  numPlayers: number,
  gameType: "sam" | "phom"
): Card[][] => {
  // Prepare empty hands for all players
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);

  if (gameType === "sam") {
    // Deal 10 cards to every player
    for (let i = 0; i < 10; i++) {
      for (let p = 0; p < numPlayers; p++) {
        const card = deck.shift(); // Remove the top card from the deck
        if (card) hands[p].push(card); // Add the card to the player's hand
      }
    }
  } else if (gameType === "phom") {
    // Deal 10 cards to the host and 9 to all other players
    for (let i = 0; i < 10; i++) {
      const card = deck.shift(); // Remove the top card from the deck
      if (card) hands[0].push(card); // Add the card to the host's hand
      if (i < 9) {
        // Other players get only 9 cards
        for (let p = 1; p < numPlayers; p++) {
          const card = deck.shift(); // Remove the top card
          if (card) hands[p].push(card); // Add the card to the player's hand
        }
      }
    }
  }

  return hands; // Return the array of player hands
};