import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonButton from "../../components/ui/NeonButton.tsx";

interface GameOptionProps {
  title: string;
  color: "cyan" | "pink";
  SubComponent?: React.FC;
}

const GameOption: React.FC<GameOptionProps> = ({ title, color, SubComponent }) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center">
      <NeonButton
        onClick={() => SubComponent ? setShowOptions(!showOptions) : navigate(`/game/${title.toLowerCase()}`)}
        color={color}
        size="lg"
        className={`w-52 h-40 rounded-lg shadow-[0_0_25px_${color}] hover:shadow-[0_0_40px_${color}] flex items-center justify-center text-center transition-transform duration-300`}
      >
        {title.toUpperCase()}
      </NeonButton>

      {showOptions && SubComponent && (
        <div
          className="absolute top-full mt-4 w-full flex flex-col items-center animate-fadeIn"
          style={{
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <SubComponent />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GameOption;