// import React from "react";
// import {Card, Suit, shuffleDeck} from "../../../../shared/cards.ts";

// interface CardProps {
//     card: Card;
//     selected?: boolean;
//     onClick?: () => void;
//     faceDown?: boolean;
//   }

//   export const PlayingCard: React.FC<CardProps> = ({ 
//     card, 
//     selected = false, 
//     onClick,
//     faceDown = false
//   }) => {
//     const { suit, rank } = card;
    
//     // Function to get the symbol and color based on the suit
//     const getSuitInfo = (suit: Suit) => {
//       switch (suit) {
//         case Suit.Heart:
//           return { symbol: '♥', color: 'red' };
//         case Suit.Diamond:
//           return { symbol: '♦', color: 'red' };
//         case Suit.Club:
//           return { symbol: '♣', color: 'black' };
//         case Suit.Spade:
//           return { symbol: '♠', color: 'black' };
//       }
//     };

//     const suitInfo = getSuitInfo(suit);

//     return (
//       <div 
//         className={`playing-card ${selected ? 'selected' : ''}`} 
//         onClick={onClick} 
//         style={{ color: suitInfo?.color }}
//       >
//         {faceDown ? '🂠' : `${rank} ${suitInfo?.symbol}`}
//       </div>
//     );
//   };