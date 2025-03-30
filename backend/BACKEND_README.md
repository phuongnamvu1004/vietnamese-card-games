## Schemas
- General

```ts
export enum Suit {
  Spade = "spade",
  Club = "club",
  Diamond = "diamond",
  Heart = "heart"
}

export class Card {
  constructor(public suit: Suit, public rank: number) {}

  toString(): string {
    const rankStr = Card.rankToString(this.rank);
    return `${rankStr}${this.suit}`;
  }

  static rankToString(rank: number): string {
    const faceCards: Record<number, string> = {
      1: 'A',
      11: 'J',
      12: 'Q',
      13: 'K',
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

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], numPlayers: number, cardsPerPlayer: number): Card[][] {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let p = 0; p < numPlayers; p++) {
      const card = deck.shift();
      if (card) hands[p].push(card);
    }
  }

  return hands;
}

```

- In-game instances 
```ts
type Player = {
  id: string,
  socketId: string,
  hand: Card[],
  state: "instantWin" | "waitingForTurn" | "inTurn"
}

type GameState = {
  roomId: string, // the 6-digit unique identifier for room
  players: Player[],
  deck: Card[], // current cards left in deck both before and after dealing
  pile: Card[], // played cards
  currentTurn: string, // socketId or userId
  // waiting is for before the started (player not ready?)
  // playing is marked by after dealing the cards 
  // finish is for then the game has finished all the turns
  phase: "waiting" | "playing" | "finish",
  instantWinPlayers: Player[]
}
```