import React from 'react';

interface CardProps {
  card: string;
  primaryColor: string;
  secondaryColor: string;
  transform: string;
  hovered: boolean;
  onHover: (state: boolean) => void;
}

const Card: React.FC<CardProps> = ({
                                     card,
                                     primaryColor,
                                     secondaryColor,
                                     transform,
                                     hovered,
                                     onHover,
                                   }) => {
  return (
    <div
      className={`w-32 h-48 bg-gradient-to-br ${primaryColor} ${secondaryColor} rounded-xl shadow-xl transition-transform ${
        hovered ? 'scale-110' : ''
      }`}
      style={{transform}}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex justify-center items-center h-full text-4xl font-bold text-white">{card}</div>
    </div>
  );
};

export default Card;