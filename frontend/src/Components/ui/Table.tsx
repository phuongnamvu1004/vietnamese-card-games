import React from "react";
import { Card } from "../../../../backend/src/game/shared/cards";
import CardDisplay from "./card/CardDisplay";

interface TableProps {
  playedCards: Card[];
}

const Table: React.FC<TableProps> = ({ playedCards }) => {
    console.log("Table rendering cards:", playedCards.map(c => c.toString()));
  if (!playedCards || playedCards.length === 0) {
    return (
      <div className="px-4 py-2 text-gray-400 italic bg-gray-800 rounded text-center">
        No cards played yet
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex">
        {playedCards.map((card, idx) => (
          <CardDisplay
            key={card.toString()}   
            card={card}
            index={idx}
            isFaceUp={true}
            transform="rotate(0deg)"
            isHovered={false}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            primaryColor="from-purple-400"
            secondaryColor="to-pink-600"
          />
        ))}
      </div>
    </div>
  );
};

export default Table;