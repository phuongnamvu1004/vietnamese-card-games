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

// Helper to create mock player
const createPlayer = (id: string, hand: Card[], mustBeat = false): Player => ({
  socketId: id,
  hand,
  buyIn: 1000,
  gameBalance: 1000,
  mustBeat,
  state: "waitingForTurn",
});

const baseGameState: CurrentGameState = {
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
  it("should return previous player in circular order", () => {
    const previous = getPreviousPlayer(baseGameState, "p1");
    expect(previous.socketId).toBe("p3");

    const previous2 = getPreviousPlayer(baseGameState, "p2");
    expect(previous2.socketId).toBe("p1");
  });
});

describe("playCard", () => {
  it("should play a valid card and update game state", () => {
    const updatedGameState = playCard(baseGameState, "p1", [card2], [card1, card2, card3]);

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
    })
  });

  // it("should set mustBeat true if one card remains", () => {
  //   const mockState = structuredClone(baseGameState);
  //   mockState.players[1].hand = [cardA, cardB];
  //   mockState.players[0].hand = [cardA, cardB]; // will play 1 card, 1 remains
  //   const move = [cardA];
  //   const currentHand = [cardA, cardB];
  //
  //   const updatedState = playCard(mockState, "p0", move, currentHand); // fake player
  //
  //   const previous = getPreviousPlayer(mockState, "p0");
  //   expect(previous.mustBeat).toBe(true);
  // });
  //
  // it("should throw error if move is invalid", () => {
  //   const mockState = structuredClone(baseGameState);
  //   const move = [cardC];
  //   const currentHand = [cardC];
  //
  //   // Change mock to return false for validation
  //   const {validateMove} = require("../game/sam/rules/validateMove");
  //   validateMove.mockImplementation(() => false);
  //
  //   expect(() => {
  //     playCard(mockState, "p1", move, currentHand);
  //   }).toThrow("Invalid move");
  // });
});
