import {Suit, Card, shuffleDeck, dealCards} from "../src/game/shared/cards";

import {MoveType, getMoveType, validateMove} from "../src/game/sam/rules";

describe("getMoveType test", () => {
  test("Move type: Single", () => {
    const card1 = new Card(Suit.Heart, 1);
    const cards: Card[] = [card1];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.SINGLE,
      idCard: 1,
    });
  })

  test("Move type: Double", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Spade, 1);
    const cards: Card[] = [card1, card2];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.DOUBLE,
      idCard: 1,
    });
  })

  test("Move type: Triplet", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Spade, 1);
    const card3 = new Card(Suit.Club, 1);
    const cards: Card[] = [card1, card2, card3];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.TRIPLET,
      idCard: 1,
    });
  })

  test("Move type: Quadruplet", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Spade, 1);
    const card3 = new Card(Suit.Club, 1);
    const card4 = new Card(Suit.Diamond, 1);
    const cards: Card[] = [card1, card2, card3, card4];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.QUADRUPLET,
      idCard: 1,
    });
  })

  test("Move type: Straight: Regular Straight-3", () => {
    const card1 = new Card(Suit.Heart, 4);
    const card2 = new Card(Suit.Spade, 5);
    const card3 = new Card(Suit.Club, 6);
    const cards: Card[] = [card1, card2, card3];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 6,
      length: 3
    });
  })

  test("Move type: Straight: Regular Straight-8", () => {
    const card1 = new Card(Suit.Heart, 4);
    const card2 = new Card(Suit.Spade, 5);
    const card3 = new Card(Suit.Club, 6);
    const card4 = new Card(Suit.Diamond, 7);
    const card5 = new Card(Suit.Heart, 8);
    const card6 = new Card(Suit.Spade, 9);
    const card7 = new Card(Suit.Club, 10);
    const card8 = new Card(Suit.Diamond, 11);
    const cards: Card[] = [card1, card2, card3, card4, card5, card6, card7, card8];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 11,
      length: 8
    });
  })

  test("Move type: Straight: Edge case straight from A", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Spade, 2);
    const card3 = new Card(Suit.Club, 3);

    const cards: Card[] = [card1, card2, card3];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 3,
      length: 3
    });
  })

  test("Move type: Straight: Edge case straight to A", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 13);
    const card3 = new Card(Suit.Club, 1);

    const cards: Card[] = [card1, card2, card3];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.STRAIGHT,
      idCard: 14,
      length: 3
    });
  })

  test("Move type: Straight: Invalid sequence", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 13);
    const card3 = new Card(Suit.Club, 2);

    const cards: Card[] = [card1, card2, card3];

    expect(getMoveType(cards)).toEqual({
      type: MoveType.INVALID,
    });
  })
})

