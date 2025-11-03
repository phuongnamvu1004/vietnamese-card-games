import { useState } from "react";
import CardDisplay from "./card/CardDisplay";
import { Card } from "../../../../backend/src/game/shared/cards";
import NeonButton from "../../components/ui/NeonButton";

interface HandProps {
  cards: Card[];
  isFaceUp?: boolean;
  onPlay?: (cards: Card[]) => void;
  onPass?: () => void;
}

const Hand: React.FC<HandProps> = ({ cards, isFaceUp = true, onPlay, onPass }) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

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
      {/* HAND DISPLAY */}
      <div className="flex justify-center">
        {cards.map((card, index) => (
          <div
            key={card.toString()}
            style={{ marginLeft: index > 0 ? "-28px" : "0" }}
          >
            <CardDisplay
              card={card}
              index={index}
              transform="rotate(0deg)"
              isFaceUp={isFaceUp}
              isHovered={hoveredCard?.toString() === card.toString()}
              onMouseEnter={() => setHoveredCard(card)}
              onMouseLeave={() => setHoveredCard(null)}
              primaryColor="from-cyan-400"
              secondaryColor="to-blue-500"
              selected={isCardSelected(card)}
              onClick={() => toggleSelect(card)}
            />
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-6 mt-6">
        <NeonButton
          color="cyan"
          size="md"
          onClick={handlePlay}
          disabled={selectedCards.length === 0}
        >
          Play
        </NeonButton>
        <NeonButton
          color="pink"
          size="md"
          onClick={handlePass}
        >
          Pass
        </NeonButton>
      </div>
    </div>
  );
};

export default Hand;