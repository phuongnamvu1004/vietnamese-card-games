import React from "react";
import CardFront from "../ui/card/CardFront";
import { Card, Suit } from "../../../../backend/src/game/shared/cards";

const CardFan: React.FC = () => {
  // Một vài lá bài để xoè
  const cards = [
    new Card(Suit.Spade, 10),  // Q♠
    new Card(Suit.Heart, 11),  // J♥
    new Card(Suit.Diamond, 12), // K♦
    new Card(Suit.Club, 13),   // 10♣
    new Card(Suit.Spade, 1),   // 9♠
  ];

  // Góc xoay & dịch để tạo fan effect
  const rotations = [-20, -10, 0, 10, 20];
  const offsets = [-80, -40, 0, 40, 80];

  return (
    <div className="relative w-[400px] h-[260px] flex justify-center items-center">
      {cards.map((card, i) => (
        <div
          key={i}
          className="absolute transition-transform duration-500"
          style={{
            transform: `rotate(${rotations[i]}deg) translateX(${offsets[i]}px) translateY(${Math.abs(rotations[i]) * 1.5}px)`,
            zIndex: i,
          }}
        >
          <CardFront card={card} />
        </div>
      ))}
    </div>
  );
};

export default CardFan;
