import React from 'react';

interface CardProps {
  card: string;
  primaryColor: string;
  secondaryColor: string;
  transform: string;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CardDisplay: React.FC<CardProps> = ({
                                            card,
                                            primaryColor,
                                            secondaryColor,
                                            transform,
                                            index,
                                            isHovered,
                                            onMouseEnter,
                                            onMouseLeave
                                          }) => {
  return (
    <div
      className={`relative bg-gray-900 rounded-lg border border-gray-700 shadow-lg flex items-center justify-center w-32 h-48 ${isHovered ? 'z-20' : 'z-10'}`}
      style={{
        transform: `${transform} translateY(${isHovered ? '-30px' : '0px'})`,
        transition: 'all 0.3s ease',
        marginLeft: index > 0 ? '-30px' : '0',
        boxShadow: isHovered ? `0 0 30px 5px rgba(6,182,212,0.7)` : ''
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`absolute inset-[2px] rounded-md bg-gradient-to-br ${primaryColor} ${secondaryColor} opacity-20`}></div>
      <span
        className={`text-transparent bg-clip-text bg-gradient-to-br ${primaryColor} ${secondaryColor} text-5xl font-bold`}>
        {card}
      </span>
      {isHovered && (
        <div
          className="absolute -inset-px rounded-lg animate-pulse border border-cyan-500"></div>
      )}
    </div>
  );
};

export default CardDisplay;