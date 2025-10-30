import React from "react";
import { useNavigate } from "react-router-dom";
import NeonButton from "../../components/ui/NeonButton.tsx";

const PhomOptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center">
      <NeonButton
        onClick={() => navigate("/join-room")}
        color="pink"
        size="md"
        fullWidth={false}
        className="w-52 h-14 rounded-lg text-xs shadow-[0_0_10px_pink] hover:shadow-[0_0_20px_pink]"
      >
        Join room
      </NeonButton>
      <NeonButton
        onClick={() => navigate("/create-room")}
        color="pink"
        size="md"
        fullWidth={false}
        className="w-52 h-14 rounded-lg text-xs shadow-[0_0_10px_pink] hover:shadow-[0_0_20px_pink]"
      >
        Play with friends
      </NeonButton>
    </div>
  );
};

export default PhomOptions;