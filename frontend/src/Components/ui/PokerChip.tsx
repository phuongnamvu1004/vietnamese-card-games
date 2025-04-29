import React from "react";

interface PokerChipProps {
  value: string;
  color: string;
  borderColor: string;
  textColor: string;
  shadow: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    rotate: string;
  };
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  index: number;
}

const PokerChip: React.FC<PokerChipProps> = ({
  value,
  color,
  borderColor,
  textColor,
  shadow,
  position,
  isHovered,
  onHover,
  onLeave,
  index,
}) => {
  const { top, left, right, rotate } = position;

  return (
    <div
      key={`chip-${index}`}
      className={`absolute ${color} w-20 h-20 rounded-full z-10 flex items-center justify-center cursor-pointer transition-all duration-300`}
      style={{
        top,
        left,
        right,
        transform: `rotate(${rotate}) ${isHovered ? "scale(1.2)" : "scale(1)"}`,
        boxShadow: isHovered
          ? `0 0 25px 5px ${shadow}`
          : `0 0 15px 2px ${shadow}`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Inner rings */}
      <div className={`absolute w-16 h-16 rounded-full border-2 ${borderColor} opacity-70`}></div>
      <div className={`absolute w-14 h-14 rounded-full border ${borderColor} opacity-40`}></div>
      <div className={`absolute w-12 h-12 rounded-full ${borderColor} opacity-20`}></div>

      {/* Value text */}
      <span className={`relative z-20 font-mono font-bold ${textColor} text-sm`}>
        {value}
      </span>

      {/* Edge pattern */}
      <div className="absolute inset-0 rounded-full">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${borderColor} opacity-80`}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              transform: `rotate(${i * 22.5}deg) translate(9.5px, 0)`,
            }}
          ></div>
        ))}
      </div>

      {isHovered && (
        <div className="absolute inset-0 rounded-full animate-pulse opacity-50 border-2 border-white"></div>
      )}
    </div>
  );
};

export default PokerChip;
