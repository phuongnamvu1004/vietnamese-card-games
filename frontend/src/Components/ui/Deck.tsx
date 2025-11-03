import React from "react";
import { Card } from "../../../../backend/src/game/shared/cards";
import CardBack from "./card/CardBack";

interface DeckProps {
  deck: Card[];
  onDraw: () => void;
  disabled?: boolean;
}

const Deck: React.FC<DeckProps> = ({ deck, onDraw, disabled = false }) => {
  const cardsToShow = deck.slice(-3);

  const handleClick = () => {
    if (!disabled && deck.length > 0) onDraw();
  };

  return (
    <div
      title={deck.length > 0 ? "Draw a card" : "Deck empty"}
      style={{
        position: "relative",
        width: "80px",
        height: "120px",
        cursor: deck.length > 0 && !disabled ? "pointer" : "not-allowed",
      }}
      onClick={handleClick}
    >
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