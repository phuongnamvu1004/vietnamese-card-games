import React from "react";

interface CoinProps {
  style?: React.CSSProperties;
  size?: number;
}

const Coin: React.FC<CoinProps> = ({ style, size = 80 }) => {
  return (
    <div
      className="relative flex items-center justify-center animate-bounce-slow"
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <div
        className="relative rounded-full border-[4px] border-amber-300 bg-amber-200 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.25)]"
        style={{
          width: size,
          height: size,
          boxShadow:
            "inset 3px 3px 8px rgba(0,0,0,0.25), 0 0 15px rgba(250,204,21,0.35)",
        }}
      >
        <div
          className="absolute rounded-full border-[2px] border-amber-100 top-[18%] left-[18%]"
          style={{
            width: size * 0.64,
            height: size * 0.64,
          }}
        ></div>

        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-amber-700 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          $
        </span>
      </div>

      <div
        className="absolute rounded-full bg-black/30 blur-md animate-pulse"
        style={{
          width: size * 0.8,
          height: size * 0.15,
          bottom: -size * 0.25,
        }}
      ></div>
    </div>
  );
};

export default Coin;
