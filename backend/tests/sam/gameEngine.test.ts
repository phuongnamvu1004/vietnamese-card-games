import { getNextPlayer, getPreviousPlayer } from "../../src/game/sam/helpers/getPlayer";
import { playCard } from "../../src/game/sam/gameEngine";
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
  currentTurn: "p1",
  lastPlayed: {socketId: "p3", cards: [lastPlayedCard]},
  phase: "playing",
  gameType: "sam",
  betUnit: 10,
  instantWinPlayers: [],
};

describe("getPlayer helper methods test", () => {
  test("should return previous player in circular order", () => {
    const previous = getPreviousPlayer(baseGameState, "p1");
    expect(previous.socketId).toBe("p3");

    const previous2 = getPreviousPlayer(baseGameState, "p2");
    expect(previous2.socketId).toBe("p1");
  });

  test("should return next player in circular order", () => {
    const next = getNextPlayer(baseGameState, "p1");
    expect(next.socketId).toBe("p2");

    const next2 = getNextPlayer(baseGameState, "p3");
    expect(next2.socketId).toBe("p1");
  });
});


describe("playCard", () => {
  test("Should play a valid card and update game state", () => {
    const updatedGameState = playCard(
      baseGameState,
      "p1", // player 1 plays
      [card2],
      false
    );

    if (!updatedGameState) throw new Error("Unexpected null game state");
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
    });

    baseGameState = updatedGameState!;
  });

  test("Should set mustBeat true if one card remains", () => {
    const updatedGameState = playCard(
      baseGameState,
      "p2",
      [card4], // play 6 of Heart
      false
    );

    if (!updatedGameState) throw new Error("Unexpected null game state");
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
    });
    expect(updatedGameState.players[0].mustBeat).toBe(true); // p1 must beat

    baseGameState = updatedGameState;
  });

  test("Should throw error if move is invalid", () => {
    expect(() => {
      playCard(baseGameState, "p3", [failedCard], false);
    }).toThrow("Invalid move");
  });

  test("Should end the round and when all players reject to play/cannot defend", () => {
    // player 3 plays card7 (9 of Heart) -> player 1 and 2 cannot defend -> should end round
    const gameStateZero = playCard(baseGameState, "p3", [card7], false);

    // player 1 and 2 pass as they cannot defend
    const gameStateOne = playCard(gameStateZero!, "p1", [], true);
    const gameStateTwo = playCard(gameStateOne!, "p2", [], true);

    // round get back to player 3 -> Refresh last played cards and play a new card
    const lastGameState = playCard(gameStateTwo!, "p3", [card6], false);

    if (!lastGameState) throw new Error("Unexpected null game state");
    expect(lastGameState).toEqual({
      ...gameStateTwo,
      players: [
        gameStateTwo.players[0],
        gameStateTwo.players[1],
        {
          ...gameStateTwo.players[2],
          hand: [], // card6 is played
        },
      ],
      lastPlayed: {socketId: "p3", cards: [card6]}, // last played card is reset and now player 3 plays a new card
    });

    baseGameState = lastGameState;
  });

  test("Should finish the game when a player has no cards left + update transactions", () => {
    // Check that game phase is finished
    expect(baseGameState.phase).toBe("finish");

    const player1 = baseGameState.players.find((p) => p.socketId === "p1")!;
    const player2 = baseGameState.players.find((p) => p.socketId === "p2")!;
    const player3 = baseGameState.players.find((p) => p.socketId === "p3")!; // Winner

    const player1Cards = player1.hand.length;
    const player2Cards = player2.hand.length;

    const player1Loss = player1Cards * 10; // betUnit = 10
    const player2Loss = player2Cards * 10; // betUnit = 10
    const totalLoss = player1Loss + player2Loss;

    expect(player1.gameBalance).toBe(1000 - player1Loss);
    expect(player2.gameBalance).toBe(1000 - player2Loss);
    expect(player3.gameBalance).toBe(1000 + totalLoss);
  });
});