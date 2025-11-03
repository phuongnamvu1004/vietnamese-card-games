import React, { useState } from "react";
import CyberpunkLayout from "../../components/layout/CyberpunkLayout";
import Navbar from "../../components/layout/Navbar";
import Deck from "../../components/ui/Deck";
import Table from "../../components/ui/Table";
import Hand from "../../components/ui/Hand";
import { Card, shuffleDeck, dealCards } from "../../../../backend/src/game/shared/cards";

const NUM_PLAYERS = 4;

const Sam: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>(() => shuffleDeck(Card.createDeck()));
  const [hands, setHands] = useState<Card[][]>(() =>
    dealCards(deck, NUM_PLAYERS, "sam")
  );
  const [playedCards, setPlayedCards] = useState<Card[]>([]);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

  const handleDraw = () => {
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const drawnCard = newDeck.pop()!;
    setDeck(newDeck);
    setHands((prev) => {
      const updated = [...prev];
      updated[0] = [...updated[0], drawnCard];
      return updated;
    });
  };

  const handlePlay = (selectedCards: Card[]) => {
    setHands((prevHands) => {
      const updated = [...prevHands];
      updated[0] = updated[0].filter(
        (c) => !selectedCards.some((sel) => sel.toString() === c.toString())
      );
      return updated;
    });
    setPlayedCards((prev) => [...prev, ...selectedCards]);
  };

  const handlePass = () => {
    console.log("You passed this turn!");
  };

  return (
    <CyberpunkLayout>
      <Navbar />
      <div className="flex flex-col min-h-screen items-center py-8">
        <h1 className="text-cyan-300 font-mono text-3xl mb-4">GAME TABLE</h1>

        <p className="text-gray-400 mb-4 text-sm">
          Cards in hand: {hands[0]?.length ?? 0} · Cards on table: {playedCards.length} · Deck: {deck.length}
        </p>

        <div className="flex flex-1 w-full justify-center items-center gap-16">
          <Deck deck={deck} onDraw={handleDraw} />
          <Table playedCards={playedCards} />
        </div>

        <div className="mt-8 w-full flex justify-center">
          <Hand
            cards={hands[0]}
            isFaceUp
            onPlay={handlePlay}
            onPass={handlePass}
          />
        </div>
      </div>
    </CyberpunkLayout>
  );
};

export default Sam;