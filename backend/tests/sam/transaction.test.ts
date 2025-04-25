import { calculateTransaction, calculateTransactionPerPlayer } from "../../src/game/sam/helpers/transaction";
import { Card, Suit } from "../../src/game/shared/cards";
import { CurrentGameState, Player } from "../../src/types/game";

// Helper to create mock players easily
const createPlayer = (id: string, hand: Card[], balance = 1000): Player => ({
  socketId: id,
  hand,
  buyIn: 1000,
  gameBalance: balance,
  mustBeat: false,
  state: "waitingForTurn",
});

describe("calculateTransactionPerPlayer", () => {
  test("Normal player (no twos, not burnt)", () => {
    const player = createPlayer("p1", [
      new Card(Suit.Heart, 3),
      new Card(Suit.Spade, 5),
      new Card(Suit.Diamond, 7),
    ]);
    const loss = calculateTransactionPerPlayer(player, 10);
    expect(loss).toBe(30); // 3 cards * 10
    expect(player.gameBalance).toBe(970);
  });

  test("Player with twos", () => {
    const player = createPlayer("p2", [
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 2),
      new Card(Suit.Diamond, 5),
    ]);
    const loss = calculateTransactionPerPlayer(player, 10);
    // (3 cards * 10) + (2 twos * 10)
    expect(loss).toBe(50);
    expect(player.gameBalance).toBe(950);
  });

  test("Player burnt (10 cards)", () => {
    const player = createPlayer("p3", Array.from({length: 10}, (_, i) => new Card(Suit.Heart, i + 3)));
    const loss = calculateTransactionPerPlayer(player, 5);
    expect(loss).toBe(100); // 20 * 5 = 100
    expect(player.gameBalance).toBe(900);
  });

  test("Player burnt (10 cards) + twos", () => {
    const player = createPlayer("p4", [
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 2),
      ...Array.from({length: 8}, (_, i) => new Card(Suit.Club, i + 3)),
    ]);
    const loss = calculateTransactionPerPlayer(player, 5);
    // (20 * 5) + (2 twos * 5) = 100 + 10 = 110
    expect(loss).toBe(110);
    expect(player.gameBalance).toBe(890);
  });

  test("Player with Four of a Kind", () => {
    const player = createPlayer("p5", [
      new Card(Suit.Heart, 7),
      new Card(Suit.Spade, 7),
      new Card(Suit.Diamond, 7),
      new Card(Suit.Club, 7),
      new Card(Suit.Heart, 8),
    ]);
    const loss = calculateTransactionPerPlayer(player, 10);
    expect(loss).toBe(300); // 30 * 10
    expect(player.gameBalance).toBe(700);
  });

  test("Player with insufficient balance", () => {
    const player = createPlayer("p6", [
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 2),
      new Card(Suit.Diamond, 2),
      new Card(Suit.Club, 2),
    ], 50); // Only has 50 left

    const loss = calculateTransactionPerPlayer(player, 10);
    expect(loss).toBe(50); // Should lose all they have
    expect(player.gameBalance).toBe(0); // Balance should be 0
  });
});

describe("calculateTransaction (full game state)", () => {
  test("Full calculation distributes correctly to winner", () => {
    const winner = createPlayer("winner", []);
    const p1 = createPlayer("p1", [
      new Card(Suit.Heart, 3),
      new Card(Suit.Spade, 5),
    ]);
    const p2 = createPlayer("p2", [
      new Card(Suit.Heart, 2),
    ]);

    const gameState: CurrentGameState = {
      players: [winner, p1, p2],
      deck: [],
      pile: [],
      currentTurn: "winner",
      lastPlayed: {socketId: "p2", cards: []},
      phase: "playing",
      gameType: "sam",
      betUnit: 5,
      instantWinPlayers: [],
    };

    calculateTransaction(gameState, [p1, p2], winner, 5);

    // p1 loss = 2 cards * 5 = 10
    // p2 loss = 1 card * 5 + 1 two * 5 = 10
    const totalGain = 20;

    expect(p1.gameBalance).toBe(990);
    expect(p2.gameBalance).toBe(990);
    const updatedWinner = gameState.players.find(p => p.socketId === "winner")!;
    expect(updatedWinner.gameBalance).toBe(1000 + totalGain);
  });
});
