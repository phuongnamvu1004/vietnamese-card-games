## Schemas
- User schema
```ts
type User = {
  id: string,
  email: string,
  fullName: string,
  password: string,
  profilePic?: string,
  statistics: {
    numGamesPlayed: number,
    numGamesWon: number,
    numInstantWins: {
      dragonStraight: number,
      fourTwos: number,
      flushHand: number,
      threeTriplets: number,
      fivePairs: number
    },
    winRate: number // numGamesWon / numGamesPlayed
  },
  currentBalance: number
}
```

- Card/deck schema
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
  buyIn: number,
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
  instantWinPlayers: Player[] // For this case, check for instant wins for all player then rank them to determine who 
}
```

- Rules schemas
**Sam's rules**
```ts
enum Move {
  pass = "pass",
  hit = "hit",
  invade = "invade"
}

class RoundType {
  static Single = new RoundType("single");
  static Pair = new RoundType("pair");
  static Triplet = new RoundType("triplet");
  static FourOfAKind = new RoundType("fourOfAKind");
  static Straight = (length: number) => new RoundType(`straight(${length})`);

  private constructor(public readonly value: string) {}

  toString() {
    return this.value;
  }

  // for straight only, check for higher straight
  static isHigherStraight(current: Card[], previous: Card[]): boolean {
    const currentRanks = current.map(card => card.rank).sort((a, b) => a - b);
    const previousRanks = previous.map(card => card.rank).sort((a, b) => a - b);

    if (currentRanks.length !== previousRanks.length) {
      return false;
    }

    return currentRanks[currentRanks.length - 1] > previousRanks[previousRanks.length - 1];
  }

}

// Check for same RoundType first then compare the highest of element of prevPlayedCards and currentCards
export const validateMove = (
  prevPlayedCards: Card[], 
  currentCards: Card[], 
  roundType?: RoundType
): boolean => {
  if (!roundType) {
    roundType = determineRoundType(prevPlayedCards);
  }

  currentRoundType = determineRoundType(currentCards);

  if (!currentRoundType || currentRoundType !== roundType) {
    return false;
  } else {

  }


  return true; // Placeholder return value
};

function determineRoundType(cards: Card[]): RoundType | undefined {
  // check for single
  if (cards.length === 1) {
    return RoundType.Single;
  }

  cardValueDict = {}

  for (const card of cards) {
    cardValueDict.card.getValue() += 1
  }
  // check for pair
  if (cards.length === 2 && cardValueDict.length === 1) {
    return RoundType.Pair;
  }

  // check for triplet
  if (cards.length === 3 && cardValueDict.length === 1) {
    return RoundType.Triplet;
  }

  // check for fourOfAKind
  if (cards.length === 4 && cardValueDict.length === 1) {
    return RoundType.FourOfAKind;
  }

  // check for straight
  if (cards.length >= 3) {
    const sortedCards = cards
      .map(card => card.rank)
      .sort((a, b) => a - b);

    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i] !== sortedCards[i - 1] + 1) {
        return undefined; // Not a straight
      }
    }

    return RoundType.Straight;
  }

  return undefined
  
}
```


