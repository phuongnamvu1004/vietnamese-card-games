// To show the dfraw pile as stacked CardBacks 
// clicking the deck should draw a card (if any left)
// Reason why choosinng to show 3 cards max ( fake the lock of the stack):
// 1. visually appealing
// 2. indicates there are cards left in the deck
// 3. avoids clutter if many cards left

import { Card } from "../../../../backend/src/game/shared/cards";
import CardBack from "./card/CardBack";
import React from "react";

interface DeckProps {
  deck: Card[];
  onDraw: () => void;
}

const Deck: React.FC<DeckProps> = ({ deck, onDraw }) => {
  const cardsToShow = deck.slice(-3);
  const handleClick = () => {
    if (deck.length > 0) {
      onDraw();
    }
  };

  return (
    <div style={{ position: "relative", width: "80px", height: "120px", cursor: deck.length > 0 ? "pointer" : "default" }} onClick={handleClick}>
      {cardsToShow.map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: -index * 4,
            left: index * 4,
            zIndex: index,
          }}
        >
          <CardBack />
        </div>
      ))}
    </div>
  );
};

export default Deck;
