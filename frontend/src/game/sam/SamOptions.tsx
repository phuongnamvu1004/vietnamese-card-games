import React from "react";
import { useNavigate } from "react-router-dom";
import NeonButton from "../../components/ui/NeonButton.tsx";

const SamOptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center">
      <NeonButton
        onClick={() => navigate("/game/sam/sam")}
        color="cyan"
        size="md"
        fullWidth={false}
        className="w-56 h-14 rounded-full text-xs shadow-[0_0_10px_cyan] hover:shadow-[0_0_20px_cyan]"
      >
        Join room
      </NeonButton>
      <NeonButton
        onClick={() => navigate("/create-room")}
        color="cyan"
        size="md"
        fullWidth={false}
        className="w-56 h-14 rounded-full text-xs shadow-[0_0_10px_cyan] hover:shadow-[0_0_20px_cyan]"
      >
        Play with friends
      </NeonButton>
    </div>
  );
};

export default SamOptions;