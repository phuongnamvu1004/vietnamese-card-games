import { Card, Suit } from "../../src/game/shared/cards";

import { getMoveType, MoveType } from "../../src/game/sam/rules/validate-move";

describe("getMoveType test", () => {
  test("Move type: Single", () => {
    const cards: Card[] = [new Card(Suit.Heart, 1)];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.SINGLE,
      idCard: 1,
    });
  });

  test("Move type: Double", () => {
    const cards: Card[] = [new Card(Suit.Heart, 1), new Card(Suit.Spade, 1)];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.DOUBLE,
      idCard: 1,
    });
  });

  test("Move type: Triplet", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 1),
      new Card(Suit.Spade, 1),
      new Card(Suit.Club, 1),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.TRIPLET,
      idCard: 1,
    });
  });

  test("Move type: Quadruplet", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 1),
      new Card(Suit.Spade, 1),
      new Card(Suit.Club, 1),
      new Card(Suit.Diamond, 1),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.QUADRUPLET,
      idCard: 1,
    });
  });

  test("Move type: Straight: Regular Straight-3", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 4),
      new Card(Suit.Spade, 5),
      new Card(Suit.Club, 6),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 6,
      length: 3,
    });
  });

  test("Move type: Straight: Regular Straight-8", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 4),
      new Card(Suit.Spade, 5),
      new Card(Suit.Club, 6),
      new Card(Suit.Diamond, 7),
      new Card(Suit.Heart, 8),
      new Card(Suit.Spade, 9),
      new Card(Suit.Club, 10),
      new Card(Suit.Diamond, 11),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 11,
      length: 8,
    });
  });

  test("Move type: Straight: Edge case straight from A", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 1),
      new Card(Suit.Spade, 2),
      new Card(Suit.Club, 3),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 3,
      length: 3,
    });
  });

  test("Move type: Straight: Edge case straight to A", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 13),
      new Card(Suit.Club, 1),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 14,
      length: 3,
    });
  });

  test("Move type: Straight: Invalid sequence", () => {
    const cards: Card[] = [
      new Card(Suit.Heart, 12),
      new Card(Suit.Spade, 13),
      new Card(Suit.Club, 2),
    ];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.INVALID,
    });
  });
});
