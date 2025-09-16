import { Card, Suit } from "../../../../../backend/src/game/shared/cards";
import "./CardFront.css";

interface CardFrontProps {
  card: Card;
}

const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  const renderSuitSymbol = () => {
    switch (card.getSuit) {
      case Suit.Heart:
        return "♥";
      case Suit.Diamond:
        return "♦";
      case Suit.Spade:
        return "♠";
      case Suit.Club:
        return "♣";
      default:
        return "";
    }
  };

  const isRed = card.getSuit === Suit.Heart || card.getSuit === Suit.Diamond;
  const suitClass = card.getSuit.toLowerCase(); 
  const rank = Card.rankToString(card.getRank);
  const suitSymbol = renderSuitSymbol();

  return (
    <div
      className={`card w-32 h-48 bg-white rounded-lg shadow-md relative flex flex-col justify-between ${suitClass}`}
    >
      {/* Top-left rank + suit */}
      <div className={`rank rank-top ${isRed ? "red" : "black"}`}>
        {rank}
        <div>{suitSymbol}</div>
      </div>

      {/* Big center suit */}
      <div className="suit main">{suitSymbol}</div>

      {/* Bottom-right rank + suit (mirrored) */}
      <div className={`rank rank-bottom ${isRed ? "red" : "black"}`}>
        {rank}
        <div>{suitSymbol}</div>
      </div>
    </div>
  );
};

export default CardFront;