import React from "react";
import { Card } from "../../../../backend/src/game/shared/cards";
import CardDisplay from "./card/CardDisplay";

interface TableProps {
  playedCards: Card[];
}

const Table: React.FC<TableProps> = ({ playedCards }) => {
  if (!playedCards || playedCards.length === 0) {
    return (
      <div className="px-4 py-3 text-gray-400 italic bg-gray-800/40 rounded-lg border border-cyan-500/30 text-center font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        No cards played yet
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      {playedCards.map((card, idx) => (
        <div
          key={card.toString()}
          style={{
            position: "relative",
            transform: `translateX(${idx * 24 - (playedCards.length - 1) * 12}px)`,
            zIndex: idx,
          }}
        >
          <CardDisplay
            card={card}
            index={idx}
            isFaceUp
            transform="rotate(0deg)"
            isHovered={false}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            primaryColor="from-purple-400"
            secondaryColor="to-pink-600"
          />
        </div>
      ))}
    </div>
  );
};

export default Table;