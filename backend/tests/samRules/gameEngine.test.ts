import { getPreviousPlayer, playCard } from "../../src/game/sam/gameEngine";
import { CurrentGameState, Player } from "../../src/types/game";
import { Card, Suit } from "../../src/game/shared/cards";

// Mock cards
// For player 1
const card1 = new Card(Suit.Heart, 3); // Example card type if string-based (adjust as needed)
const card2 = new Card(Suit.Spade, 4);
const card3 = new Card(Suit.Heart, 5);

// For player 2
const card4 = new Card(Suit.Heart, 6);
const card5 = new Card(Suit.Diamond, 7);

// For player 3
const card6 = new Card(Suit.Spade, 8);
const card7 = new Card(Suit.Heart, 9);

// Last played card
const lastPlayedCard = new Card(Suit.Club, 3);

// Failed card
const failedCard = new Card(Suit.Spade, 9);

// Helper to create mock player
const createPlayer = (id: string, hand: Card[], mustBeat = false): Player => ({
  socketId: id,
  hand,
  buyIn: 1000,
  gameBalance: 1000,
  mustBeat,
  state: "waitingForTurn",
});

let baseGameState: CurrentGameState = {
  players: [
    createPlayer("p1", [card1, card2, card3]),
    createPlayer("p2", [card4, card5]),
    createPlayer("p3", [card6, card7]),
  ],
  deck: [], // don't need this for the test
  pile: [], // don't need this for the test (and not even for Sam implementation)
  currentTurn: "p1",
  lastPlayed: {socketId: "p3", cards: [lastPlayedCard]},
  phase: "playing",
  gameType: "sam",
  valuePerCard: 10,
  instantWinPlayers: [],
};

describe("getPreviousPlayer", () => {
  test("should return previous player in circular order", () => {
    const previous = getPreviousPlayer(baseGameState, "p1");
    expect(previous.socketId).toBe("p3");

    const previous2 = getPreviousPlayer(baseGameState, "p2");
    expect(previous2.socketId).toBe("p1");
  });
});

describe("playCard", () => {
  test("Should play a valid card and update game state", () => {
    const updatedGameState = playCard(
      baseGameState,
      "p1",
      [card2],
      false
    );

    baseGameState = updatedGameState;

    expect(updatedGameState).toEqual({
      ...baseGameState,
      players: [
        {
          ...baseGameState.players[0],
          hand: [card1, card3], // card2 is played
        },
        baseGameState.players[1],
        baseGameState.players[2],
      ],
      lastPlayed: {socketId: "p1", cards: [card2]},
      pile: [card2], // card2 is added to the pile
    });
  });

  test("Should set mustBeat true if one card remains", () => {
    const updatedGameState = playCard(
      baseGameState,
      "p2",
      [card4], // play 6 of Heart
      false
    );

    baseGameState = updatedGameState;

    expect(updatedGameState).toEqual({
      ...baseGameState,
      players: [
        baseGameState.players[0],
        {
          ...baseGameState.players[1],
          hand: [card5], // card4 is played
        },
        baseGameState.players[2],
      ],
      lastPlayed: {socketId: "p2", cards: [card4]},
      pile: [card2, card4], // card2 is added to the pile
    });
    expect(updatedGameState.players[0].mustBeat).toBe(true); // p1 must beat
  });

  test("Should throw error if move is invalid", () => {
    expect(() => {
      playCard(baseGameState, "p3", [failedCard], false);
    }).toThrow("Invalid move");
  });

  test("Should end the round and when all players reject to play/cannot defend", () => {
    // TODO: Play a valid move for player 3 which cannot be defended by player 1 and 2 -> have to end round -> continue playing
  });

  test("Should finish the game when a player has no cards left + update transactions", () => {
    // TODO: Player 3 continue playing and play all cards -> player 3 wins -> update game state (phase = "finish") -> update transactions
  });
});
