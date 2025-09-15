// To render a row of cards for one player 
// Features: cards slightly overlapped, hover animation, selection toggle

import { useState } from "react";
import CardDisplay from "../../Components/ui/card/CardDisplay";
import { Card } from "../../../../backend/src/game/shared/cards";

interface HandProps {
  cards: Card[];
  isFaceUp?: boolean;
  onPlay?: (cards: Card[]) => void;
  onPass?: () => void;
}

const Hand: React.FC<HandProps> = ({ cards, isFaceUp = true, onPlay, onPass }) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const isCardSelected = (card: Card) =>
    selectedCards.some((c) => c.toString() === card.toString());

  const toggleSelect = (card: Card) => {
    setSelectedCards((prev) =>
      prev.some((c) => c.toString() === card.toString())
        ? prev.filter((c) => c.toString() !== card.toString())
        : [...prev, card]
    );
  };

  const handlePlay = () => {
    if (selectedCards.length > 0 && onPlay) {
      onPlay(selectedCards);
      setSelectedCards([]);
    }
  };

  const handlePass = () => {
    if (onPass) onPass();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {cards.map((card, index) => (
          <CardDisplay
            key={card.toString()}   
            card={card}
            index={index}
            transform="rotate(0deg)"
            isFaceUp={isFaceUp}
            isHovered={false}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            primaryColor="from-cyan-400"
            secondaryColor="to-blue-500"
            selected={isCardSelected(card)}
            onClick={() => toggleSelect(card)}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={handlePlay}
          disabled={selectedCards.length === 0}
        >
          Play
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={handlePass}
        >
          Pass
        </button>
      </div>
    </div>
  );
};

export default Hand;