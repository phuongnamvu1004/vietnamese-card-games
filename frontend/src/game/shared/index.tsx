import React from "react";
import GameOption from "./GameOptions.tsx";

const GameSelect: React.FC = () => {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 gap-6 pt-8">
      <h1 className="text-3xl font-mono text-cyan-300 glitch-text mb-6">
        CHOOSE YOUR GAME
      </h1>

      <div className="flex justify-center gap-12 w-full max-w-3xl">
        <GameOption title="Sâm" color="cyan" />
        <GameOption title="Phỏm" color="pink" />
      </div>

      <div className="absolute bottom-6 w-full text-center text-cyan-400 font-mono text-sm">
        / ENJOY THE TRADITIONAL VIETNAMESE CARD EXPERIENCE /
      </div>
    </div>
  );
};

export default GameSelect;