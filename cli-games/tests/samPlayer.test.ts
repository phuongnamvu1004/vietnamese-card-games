import { Card, CardSuit } from "../cards";
import { SamUserPlayer } from "../sam/samPlayer";

describe('testing sam instant-win hand', () => {
    test('10-card flush', () => {
        const cards: Card[] = [
            new Card(2, CardSuit.Clubs),
            new Card(3, CardSuit.Diamonds),
            new Card(4, CardSuit.Hearts),
            new Card(5, CardSuit.Spades),
            new Card(6, CardSuit.Clubs),
            new Card(7, CardSuit.Diamonds),
            new Card(8, CardSuit.Hearts),
            new Card(9, CardSuit.Spades),
            new Card(10, CardSuit.Clubs),
            new Card(11, CardSuit.Diamonds)
        ];

        const testPlayer = new SamUserPlayer(cards);
        expect(testPlayer.tenCardFlush()).toBe(true);
    })
    test('four of a kind for 2\'s', () => {
        const cards: Card[] = [
            new Card(2, CardSuit.Clubs),
            new Card(2, CardSuit.Diamonds),
            new Card(2, CardSuit.Hearts),
            new Card(2, CardSuit.Spades),
            new Card(6, CardSuit.Clubs),
            new Card(7, CardSuit.Diamonds),
            new Card(13, CardSuit.Hearts),
            new Card(9, CardSuit.Spades),
            new Card(10, CardSuit.Clubs),
            new Card(11, CardSuit.Diamonds)
        ];

        const testPlayer = new SamUserPlayer(cards);
        expect(testPlayer.fourTwos()).toBe(true);
    }) 
    test('all black or red', () => {
        const cards1: Card[] = [
            new Card(2, CardSuit.Clubs),
            new Card(2, CardSuit.Spades),
            new Card(3, CardSuit.Clubs),
            new Card(4, CardSuit.Spades),
            new Card(6, CardSuit.Clubs),
            new Card(7, CardSuit.Spades),
            new Card(13, CardSuit.Clubs),
            new Card(9, CardSuit.Spades),
            new Card(10, CardSuit.Clubs),
            new Card(11, CardSuit.Spades)
        ];

        const cards2: Card[] = [
            new Card(2, CardSuit.Hearts),
            new Card(3, CardSuit.Diamonds),
            new Card(4, CardSuit.Hearts),
            new Card(5, CardSuit.Diamonds),
            new Card(6, CardSuit.Hearts),
            new Card(7, CardSuit.Diamonds),
            new Card(8, CardSuit.Hearts),
            new Card(9, CardSuit.Diamonds),
            new Card(10, CardSuit.Hearts),
            new Card(11, CardSuit.Diamonds)
        ];

        const testPlayer1 = new SamUserPlayer(cards1);
        const testPlayer2 = new SamUserPlayer(cards2);
        expect(testPlayer1.allColor()).toBe(true);
        expect(testPlayer2.allColor()).toBe(true);
    })

    test('3 collections of three of a kind', () => {
        const cards = [
            new Card(2, CardSuit.Clubs),
            new Card(2, CardSuit.Diamonds),
            new Card(2, CardSuit.Hearts),
            new Card(5, CardSuit.Spades),
            new Card(5, CardSuit.Clubs),
            new Card(5, CardSuit.Diamonds),
            new Card(9, CardSuit.Hearts),
            new Card(9, CardSuit.Spades),
            new Card(9, CardSuit.Clubs),
            new Card(11, CardSuit.Diamonds)
        ];

        const testPlayer = new SamUserPlayer(cards);
        expect(testPlayer.threeThrees()).toBe(true)
    })

    test('five pairs', () => {
        const cards = [
            new Card(2, CardSuit.Clubs),
            new Card(2, CardSuit.Diamonds),
            new Card(4, CardSuit.Hearts),
            new Card(4, CardSuit.Spades),
            new Card(6, CardSuit.Clubs),
            new Card(6, CardSuit.Diamonds),
            new Card(8, CardSuit.Hearts),
            new Card(8, CardSuit.Spades),
            new Card(10, CardSuit.Clubs),
            new Card(10, CardSuit.Diamonds)
        ];

        const testPlayer = new SamUserPlayer(cards);
        expect(testPlayer.fivePairs()).toBe(true)
    })
}) 



