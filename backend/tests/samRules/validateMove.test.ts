import { Card, Suit } from "../../src/game/shared/cards";
import {
  MoveStatus,
  validateMove,
} from "../../src/game/sam/rules/validateMove";

describe("validateMove test", () => {
  test("Validate move: Single", () => {
    const prevCards = [new Card(Suit.Heart, 12)];
    const move = [new Card(Suit.Spade, 13)];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    ); // temporarily set currentHand === move
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Single with two", () => {
    const prevCards = [new Card(Suit.Heart, 12)];
    const move = [new Card(Suit.Spade, 2)];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Single with must-beat", () => {
    const prevCards = [new Card(Suit.Heart, 3)];
    const move1 = [new Card(Suit.Spade, 12)];
    const move2 = [new Card(Suit.Spade, 10)];
    const currentHand = [
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 10),
      new Card(Suit.Diamond, 9),
      new Card(Suit.Heart, 8),
    ];

    expect(validateMove(prevCards, move1, currentHand, true)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards, move2, currentHand, true)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Single with must-beat with 2", () => {
    const prevCards = [new Card(Suit.Heart, 3)];
    const move1 = [new Card(Suit.Spade, 2)];
    const move2 = [new Card(Suit.Spade, 10)];
    const currentHand = [
      new Card(Suit.Spade, 2),
      new Card(Suit.Club, 10),
      new Card(Suit.Diamond, 9),
      new Card(Suit.Heart, 8),
    ];

    expect(validateMove(prevCards, move1, currentHand, true)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards, move2, currentHand, true)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Single with must-beat with Ace", () => {
    const prevCards = [new Card(Suit.Heart, 3)];
    const move1 = [new Card(Suit.Spade, 1)];
    const move2 = [new Card(Suit.Spade, 10)];
    const currentHand = [
      new Card(Suit.Spade, 1),
      new Card(Suit.Club, 10),
      new Card(Suit.Diamond, 9),
      new Card(Suit.Heart, 8),
    ];

    expect(validateMove(prevCards, move1, currentHand, true)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards, move2, currentHand, true)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Single with must-beat with Ace and Two", () => {
    const prevCards = [new Card(Suit.Heart, 3)];
    const move1 = [new Card(Suit.Club, 2)];
    const move2 = [new Card(Suit.Spade, 1)];
    const currentHand = [
      new Card(Suit.Spade, 1),
      new Card(Suit.Club, 2),
      new Card(Suit.Diamond, 9),
      new Card(Suit.Heart, 8),
    ];

    expect(validateMove(prevCards, move1, currentHand, true)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards, move2, currentHand, true)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Other Types with must-beat", () => {
    const prevCards = [new Card(Suit.Heart, 3), new Card(Suit.Spade, 3)];
    const move1 = [new Card(Suit.Spade, 12), new Card(Suit.Club, 12)];
    const move2 = [new Card(Suit.Club, 12)];
    const currentHand = [
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 12),
      new Card(Suit.Club, 11),
      new Card(Suit.Heart, 8),
    ];

    expect(validateMove(prevCards, move1, currentHand, true)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards, move2, currentHand, true)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Double", () => {
    const prevCards1 = [new Card(Suit.Heart, 12), new Card(Suit.Spade, 12)];
    const move1 = [new Card(Suit.Heart, 13), new Card(Suit.Spade, 13)];
    const move1_false = [new Card(Suit.Heart, 12), new Card(Suit.Spade, 13)];

    const prevCards2 = [new Card(Suit.Heart, 13), new Card(Suit.Spade, 13)];
    const move2 = [new Card(Suit.Heart, 12), new Card(Suit.Spade, 12)];

    expect(validateMove(prevCards1, move1, move1, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards2, move2, move2, false)).toEqual(
      MoveStatus.INVALID,
    );
    expect(validateMove(prevCards1, move1_false, move1_false, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Double with twos", () => {
    const prevCards = [new Card(Suit.Heart, 12), new Card(Suit.Spade, 12)];
    const move = [new Card(Suit.Heart, 2), new Card(Suit.Spade, 2)];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Triplet", () => {
    const prevCards = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 12),
    ];
    const move = [
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 13),
      new Card(Suit.Club, 13),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Triplet with twos", () => {
    const prevCards = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 12),
    ];
    const move = [
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 2),
      new Card(Suit.Club, 2),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Quadruplet", () => {
    const prevCards = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 12),
      new Card(Suit.Diamond, 12),
    ];
    const move = [
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 13),
      new Card(Suit.Club, 13),
      new Card(Suit.Diamond, 13),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(move, prevCards, prevCards, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  // No need to check for quadruplet with twos since four twos will be instant win
  test("Validate move: Quadruplet stop two", () => {
    const prevCards = [new Card(Suit.Heart, 2)];
    const move = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 12),
      new Card(Suit.Club, 12),
      new Card(Suit.Diamond, 12),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.QUADRUPLET_STOP_TWO,
    );
  });

  test("Validate move: Straight", () => {
    const prevCards = [
      new Card(Suit.Heart, 2),
      new Card(Suit.Heart, 3),
      new Card(Suit.Spade, 4),
    ];
    const move = [
      new Card(Suit.Club, 3),
      new Card(Suit.Diamond, 4),
      new Card(Suit.Diamond, 5),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
  });

  test("Validate move: Straight edge case: Containing Ace", () => {
    const prevCards1 = [
      new Card(Suit.Heart, 1),
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 3),
    ];
    const prevCards2 = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 1),
    ];
    const move = [
      new Card(Suit.Club, 3),
      new Card(Suit.Diamond, 4),
      new Card(Suit.Diamond, 5),
    ];

    expect(validateMove(prevCards1, move, move, false)).toEqual(
      MoveStatus.VALID,
    );
    expect(validateMove(prevCards2, move, move, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Invalid current move", () => {
    const prevCards = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 1),
    ];
    // Invalid double
    const move1 = [new Card(Suit.Heart, 12), new Card(Suit.Heart, 13)];

    // Invalid triplet
    const move2 = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 13),
    ];

    // Invalid quadruplet
    const move3 = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Heart, 13),
      new Card(Suit.Spade, 13),
      new Card(Suit.Club, 13),
    ];

    // Invalid straight
    const move4 = [
      new Card(Suit.Club, 3),
      new Card(Suit.Diamond, 4),
      new Card(Suit.Diamond, 6),
    ];

    expect(validateMove(prevCards, move1, move1, false)).toEqual(
      MoveStatus.INVALID,
    );
    expect(validateMove(prevCards, move2, move2, false)).toEqual(
      MoveStatus.INVALID,
    );
    expect(validateMove(prevCards, move3, move3, false)).toEqual(
      MoveStatus.INVALID,
    );
    expect(validateMove(prevCards, move4, move4, false)).toEqual(
      MoveStatus.INVALID,
    );
  });

  test("Validate move: Straight of different length: False case", () => {
    const prevCards = [
      new Card(Suit.Heart, 1),
      new Card(Suit.Heart, 2),
      new Card(Suit.Spade, 3),
    ];
    const move = [
      new Card(Suit.Club, 3),
      new Card(Suit.Diamond, 4),
      new Card(Suit.Diamond, 5),
      new Card(Suit.Diamond, 6),
    ];

    expect(validateMove(prevCards, move, move, false)).toEqual(
      MoveStatus.INVALID,
    );
  });
});
