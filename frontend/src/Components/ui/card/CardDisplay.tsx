import React from "react";
import { Card } from "../../../../../backend/src/game/shared/cards";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

interface CardProps {
  card: Card;
  primaryColor: string;
  secondaryColor: string;
  transform: string;
  index: number;
  isFaceUp: boolean;
  isHovered: boolean;
  selected?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick?: () => void;
}

const CardDisplay: React.FC<CardProps> = ({
  card,
  transform,
  index,
  isFaceUp,
  isHovered,
  selected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const flip = isFaceUp ? "rotateY(0deg)" : "rotateY(180deg)";
  const translateY = selected
    ? "-40px"
    : isHovered
    ? "-30px"
    : "0";

  const fullTransform = `${transform} ${flip} translateY(${translateY})`;

  return (
    <div
      // ✅ Important: key should be passed from parent as `key={card.toString()}`
      className={`relative w-24 h-36 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
        rounded-xl border border-gray-600/50 shadow-lg flex items-center justify-center 
        cursor-pointer transition-transform duration-500 ease-out
        ${selected ? "ring-4 ring-cyan-400 shadow-cyan-500/60 scale-105" : ""}
        ${isHovered ? "hover:scale-105" : ""}`}
      style={{
        marginLeft: index > 0 ? "-20px" : "0",
        transform: fullTransform,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Front */}
      <div
        className="absolute w-full h-full flex items-center justify-center backface-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
        <CardFront
          card={card}
        />
      </div>
      {/* Back */}
      <div
        className="absolute w-full h-full flex items-center justify-center backface-hidden"
        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
      >
        <CardBack />
      </div>
    </div>
  );
};

export default CardDisplay;