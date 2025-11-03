import React, { useState } from "react";
import { Card, shuffleDeck, dealCards } from "../../../../backend/src/game/shared/cards";
import Hand from "../../components/ui/Hand";
import Table from "../../components/ui/Table";
import CyberpunkLayout from "../../components/layout/CyberpunkLayout";
import Navbar from "../../components/layout/Navbar";

const NUM_PLAYERS = 4;

const Sam: React.FC = () => {
  const [hands, setHands] = useState<Card[][]>(() =>
    dealCards(shuffleDeck(Card.createDeck()), NUM_PLAYERS, "sam")
  );
  const [playedCards, setPlayedCards] = useState<Card[]>([]);

  const handlePlay = (selectedCards: Card[]) => {
    setHands((prevHands) => {
      const newHands = [...prevHands];
      newHands[0] = newHands[0].filter(
        (card) =>
          !selectedCards.some(
            (sel) => sel.toString() === card.toString()
          )
      );
      console.log("Played:", selectedCards.map((c) => c.toString()));
      console.log("Remaining in hand:", newHands[0].map((c) => c.toString()));
      return newHands;
    });
    setPlayedCards((prev) => [...prev, ...selectedCards]);
  };

  const handlePass = () => {
    console.log("Player passed.");
  };

  return (
    <CyberpunkLayout>
      <Navbar />
      <div className="flex flex-col min-h-screen justify-between items-center py-6">
        <h1 className="text-white text-3xl mb-8">Sâm Game</h1>
        <p className="text-gray-300 mb-2 text-sm">
          Your hand: {hands[0]?.length ?? 0} cards &middot; Table:{" "}
          {playedCards.length} cards
        </p>
        <div className="flex-1 flex items-center justify-center">
          <Table playedCards={playedCards} />
        </div>
        <div className="w-full flex justify-center mb-8">
          <Hand
            cards={hands[0]}
            isFaceUp={true}
            onPlay={handlePlay}
            onPass={handlePass}
          />
        </div>
      </div>
    </CyberpunkLayout>
  );
};

export default Sam;