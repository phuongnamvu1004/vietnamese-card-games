import { Card, Suit } from "../src/game/shared/cards";
import { validateMove } from "../src/game/sam/rules/validateMove";

describe("validateMove test", () => {
  test("Validate move: Single", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 13);

    const prevCards = [card1];
    const move = [card2];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Single: False case", () => {
    const card1 = new Card(Suit.Heart, 13);
    const card2 = new Card(Suit.Spade, 12);

    const prevCards = [card1];
    const move = [card2];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Single with two", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 2);

    const prevCards = [card1];
    const move = [card2];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Single with two: False case", () => {
    const card1 = new Card(Suit.Heart, 2);
    const card2 = new Card(Suit.Spade, 12);

    const prevCards = [card1];
    const move = [card2];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Double", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 12);

    const card3 = new Card(Suit.Heart, 13);
    const card4 = new Card(Suit.Spade, 13);

    const prevCards = [card1, card2];
    const move = [card3, card4];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Double: False case", () => {
    const card1 = new Card(Suit.Heart, 13);
    const card2 = new Card(Suit.Spade, 13);

    const card3 = new Card(Suit.Heart, 12);
    const card4 = new Card(Suit.Spade, 12);

    const prevCards = [card1, card2];
    const move = [card3, card4];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Double with twos", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 12);

    const card3 = new Card(Suit.Heart, 2);
    const card4 = new Card(Suit.Spade, 2);

    const prevCards = [card1, card2];
    const move = [card3, card4];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Double with twos: False case", () => {
    const card1 = new Card(Suit.Heart, 2);
    const card2 = new Card(Suit.Spade, 2);

    const card3 = new Card(Suit.Heart, 12);
    const card4 = new Card(Suit.Spade, 12);

    const prevCards = [card1, card2];
    const move = [card3, card4];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Triplet", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 12);
    const card3 = new Card(Suit.Club, 12);

    const card4 = new Card(Suit.Heart, 13);
    const card5 = new Card(Suit.Spade, 13);
    const card6 = new Card(Suit.Club, 13);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Triplet: False case", () => {
    const card1 = new Card(Suit.Heart, 13);
    const card2 = new Card(Suit.Spade, 13);
    const card3 = new Card(Suit.Club, 13);

    const card4 = new Card(Suit.Heart, 12);
    const card5 = new Card(Suit.Spade, 12);
    const card6 = new Card(Suit.Club, 12);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Triplet with twos", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 12);
    const card3 = new Card(Suit.Club, 12);

    const card4 = new Card(Suit.Heart, 2);
    const card5 = new Card(Suit.Spade, 2);
    const card6 = new Card(Suit.Club, 2);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Triplet with twos: False case", () => {
    const card1 = new Card(Suit.Heart, 2);
    const card2 = new Card(Suit.Spade, 2);
    const card3 = new Card(Suit.Club, 2);

    const card4 = new Card(Suit.Heart, 12);
    const card5 = new Card(Suit.Spade, 12);
    const card6 = new Card(Suit.Club, 12);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Quadruplet", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Spade, 12);
    const card3 = new Card(Suit.Club, 12);
    const card4 = new Card(Suit.Diamond, 12);

    const card5 = new Card(Suit.Heart, 13);
    const card6 = new Card(Suit.Spade, 13);
    const card7 = new Card(Suit.Club, 13);
    const card8 = new Card(Suit.Diamond, 13);


    const prevCards = [card1, card2, card3, card4];
    const move = [card5, card6, card7, card8];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Quadruplet: False case", () => {
    const card1 = new Card(Suit.Heart, 13);
    const card2 = new Card(Suit.Spade, 13);
    const card3 = new Card(Suit.Club, 13);
    const card4 = new Card(Suit.Diamond, 13);

    const card5 = new Card(Suit.Heart, 12);
    const card6 = new Card(Suit.Spade, 12);
    const card7 = new Card(Suit.Club, 12);
    const card8 = new Card(Suit.Diamond, 12);


    const prevCards = [card1, card2, card3, card4];
    const move = [card5, card6, card7, card8];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  // No need to check for quadruplet with twos since four twos will be instant win
  test("Validate move: Quadruplet stop two", () => {
    const card1 = new Card(Suit.Heart, 2);

    const card2 = new Card(Suit.Heart, 12);
    const card3 = new Card(Suit.Spade, 12);
    const card4 = new Card(Suit.Club, 12);
    const card5 = new Card(Suit.Diamond, 12);

    const prevCards = [card1];
    const move = [card2, card3, card4, card5];

    expect(validateMove(prevCards, move)).toEqual("quadrupletStopTwo");
  })

  test("Validate move: Straight", () => {
    const card1 = new Card(Suit.Heart, 2);
    const card2 = new Card(Suit.Heart, 3);
    const card3 = new Card(Suit.Spade, 4);

    const card4 = new Card(Suit.Club, 3);
    const card5 = new Card(Suit.Diamond, 4);
    const card6 = new Card(Suit.Diamond, 5);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Straight edge case: Containing Ace", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Heart, 2);
    const card3 = new Card(Suit.Spade, 3);

    const card4 = new Card(Suit.Club, 3);
    const card5 = new Card(Suit.Diamond, 4);
    const card6 = new Card(Suit.Diamond, 5);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(true);
  })

  test("Validate move: Straight edge case: Straight ends with Ace: False case", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Heart, 13);
    const card3 = new Card(Suit.Spade, 1);

    const card4 = new Card(Suit.Club, 3);
    const card5 = new Card(Suit.Diamond, 4);
    const card6 = new Card(Suit.Diamond, 5);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Invalid current move", () => {
    const card1 = new Card(Suit.Heart, 12);
    const card2 = new Card(Suit.Heart, 13);
    const card3 = new Card(Suit.Spade, 1);

    const card4 = new Card(Suit.Club, 3);
    const card5 = new Card(Suit.Diamond, 4);
    const card6 = new Card(Suit.Diamond, 6);

    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6];

    expect(validateMove(prevCards, move)).toEqual(false);
  })

  test("Validate move: Straight of different length: False case", () => {
    const card1 = new Card(Suit.Heart, 1);
    const card2 = new Card(Suit.Heart, 2);
    const card3 = new Card(Suit.Spade, 3);

    const card4 = new Card(Suit.Club, 3);
    const card5 = new Card(Suit.Diamond, 4);
    const card6 = new Card(Suit.Diamond, 5);
    const card7 = new Card(Suit.Diamond, 6);


    const prevCards = [card1, card2, card3];
    const move = [card4, card5, card6, card7];

    expect(validateMove(prevCards, move)).toEqual(false);
  })
})