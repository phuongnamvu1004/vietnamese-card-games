import { Suit, Card, shuffleDeck, dealCards } from "../src/game/shared/cards";

describe("Card class test", () => {
  test("Card creation + string representation + getRank", () => {
    const card = new Card(Suit.Heart, 1);
    expect(card.toString()).toBe("A of heart");
    expect(card.getRank).toBe(1);
  });

  test("Deck creation", () => {
    const deck = Card.createDeck();
    expect(deck.length).toBe(52);
    expect(deck[0].toString()).toBe("A of spade");
    expect(deck[51].toString()).toBe("K of heart");
  });

  test("Deck shuffle", () => {
    const deck = Card.createDeck();
    const shuffledDeck = shuffleDeck(deck);
    expect(shuffledDeck.length).toBe(52);
    expect(shuffledDeck).not.toEqual(deck);
  });

  test("Deal cards", () => {
    const deck = Card.createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const hands = dealCards(shuffledDeck, 4, 5);
    expect(hands.length).toBe(4);
    expect(hands[0].length).toBe(5);
    expect(hands[1].length).toBe(5);
    expect(hands[2].length).toBe(5);
    expect(hands[3].length).toBe(5);
  });

  test("Deal cards with insufficient deck", () => { 
    const deck = Card.createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const hands = dealCards(shuffledDeck, 4, 20);
    expect(hands.length).toBe(4);
    expect(hands[0].length).toBe(13);
    expect(hands[1].length).toBe(13);
    expect(hands[2].length).toBe(13);
    expect(hands[3].length).toBe(13);
  });

})