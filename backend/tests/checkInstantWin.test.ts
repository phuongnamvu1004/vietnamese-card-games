import { checkInstantWin, InstantWinType } from "../src/game/sam/rules/checkInstantWin";
import { Card, Suit } from "../src/game/shared/cards";

describe("checkInstantWin test", () => {
    test("Check Dragon Straight", () => {
        const cards = [
            new Card(Suit.Heart, 1),
            new Card(Suit.Spade, 2),
            new Card(Suit.Spade, 3),
            new Card(Suit.Spade, 4),
            new Card(Suit.Spade, 5),
            new Card(Suit.Spade, 6),
            new Card(Suit.Spade, 7),
            new Card(Suit.Spade, 8),
            new Card(Suit.Spade, 9),
            new Card(Suit.Spade, 10)
        ];


        expect(checkInstantWin(cards)).toBe(InstantWinType.DragonStraight)
    })

    test("Check Dragon Straight: Edge case for A", () => {
        const cards = [
            new Card(Suit.Spade, 5),
            new Card(Suit.Spade, 6),
            new Card(Suit.Heart, 7),
            new Card(Suit.Spade, 8),
            new Card(Suit.Spade, 9),
            new Card(Suit.Club, 10),
            new Card(Suit.Spade, 11),
            new Card(Suit.Spade, 12),
            new Card(Suit.Heart, 13),
            new Card(Suit.Spade, 1)
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.DragonStraight)
    })

    test("Check Flush Hand: red", () => {
        const cards = [
            new Card(Suit.Heart, 3),
            new Card(Suit.Diamond, 4),
            new Card(Suit.Heart, 5),
            new Card(Suit.Diamond, 5),
            new Card(Suit.Heart, 7),
            new Card(Suit.Diamond, 8),
            new Card(Suit.Heart, 9),
            new Card(Suit.Diamond, 13),
            new Card(Suit.Heart, 11),
            new Card(Suit.Diamond, 12),
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FlushHand);
    })

    test("Check Flush Hand: black", () => {
        const cards = [
            new Card(Suit.Spade, 3),
            new Card(Suit.Club, 4),
            new Card(Suit.Spade, 5),
            new Card(Suit.Club, 5),
            new Card(Suit.Spade, 7),
            new Card(Suit.Club, 8),
            new Card(Suit.Spade, 9),
            new Card(Suit.Club, 13),
            new Card(Suit.Spade, 11),
            new Card(Suit.Club, 12),
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FlushHand);
    })

    test("Check Four Twos", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Heart, 2),
            new Card(Suit.Diamond, 2),
            new Card(Suit.Spade, 3),
            new Card(Suit.Club, 4),
            new Card(Suit.Heart, 5),
            new Card(Suit.Diamond, 6),
            new Card(Suit.Spade, 7),
            new Card(Suit.Club, 8),
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FourTwos);
    })

    test("Check Three Triplets", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Heart, 2),
            new Card(Suit.Diamond, 3),
            new Card(Suit.Spade, 3),
            new Card(Suit.Club, 3),
            new Card(Suit.Heart, 4),
            new Card(Suit.Diamond, 4),
            new Card(Suit.Spade, 4),
            new Card(Suit.Club, 7),
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.ThreeTriplets);
    })

    test("Check Five Pairs", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Heart, 3),
            new Card(Suit.Diamond, 3),
            new Card(Suit.Spade, 4),
            new Card(Suit.Club, 4),
            new Card(Suit.Heart, 5),
            new Card(Suit.Diamond, 5),
            new Card(Suit.Spade, 6),
            new Card(Suit.Club, 6),
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FivePairs);
    })

    test("Check Instant Win priority: Dragon Straight > Flush Hand", () => {
        const cards = [
            new Card(Suit.Spade, 1),
            new Card(Suit.Spade, 2),
            new Card(Suit.Spade, 3),
            new Card(Suit.Spade, 4),
            new Card(Suit.Spade, 5),
            new Card(Suit.Spade, 6),
            new Card(Suit.Spade, 7),
            new Card(Suit.Spade, 8),
            new Card(Suit.Club, 9),
            new Card(Suit.Club, 10)
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.DragonStraight);
    })

    test("Check Instant Win priority: Four Twos > Three Triplets", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Heart, 2),
            new Card(Suit.Diamond, 2),
            new Card(Suit.Spade, 3),
            new Card(Suit.Club, 3),
            new Card(Suit.Heart, 3),
            new Card(Suit.Spade, 4),
            new Card(Suit.Club, 4),
            new Card(Suit.Heart, 4)
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FourTwos);
    })

    test("Check Instant Win priority: Flush Hand > Five Pairs", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Spade, 3),
            new Card(Suit.Club, 3),
            new Card(Suit.Spade, 4),
            new Card(Suit.Club, 4),
            new Card(Suit.Spade, 5),
            new Card(Suit.Club, 5),
            new Card(Suit.Spade, 6),
            new Card(Suit.Club, 6)
        ];

        expect(checkInstantWin(cards)).toBe(InstantWinType.FlushHand);
    });

    test("No Instant Win", () => {
        const cards = [
            new Card(Suit.Spade, 2),
            new Card(Suit.Club, 2),
            new Card(Suit.Heart, 3),
            new Card(Suit.Club, 4),
            new Card(Suit.Spade, 5),
            new Card(Suit.Club, 7),
            new Card(Suit.Spade, 8),
            new Card(Suit.Club, 9),
            new Card(Suit.Spade, 10),
        ]
        expect(checkInstantWin(cards)).toBe(InstantWinType.None);
    })


})