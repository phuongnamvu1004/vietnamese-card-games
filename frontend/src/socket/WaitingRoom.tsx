import React from "react";
import { useNavigate } from "react-router-dom";
import CyberpunkLayout from "../components/layout/CyberpunkLayout";
import NeonButton from "../components/ui/NeonButton";
import Dice3D from "../components/ui/Dice";

interface Player {
  id: number;
  name: string;
  avatar?: string;
}


interface WaitingRoomProps {
  gameType: "sam" | "phom";
  roomId?: string;
  hostId?: string;
  players?: Player[];
  isHost?: boolean;
  onStart?: () => void;
  onLeave?: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  gameType,
  roomId = "ROOM-XXXX",
  hostId = "",
  players = [],
  isHost = false,
  onStart,
  onLeave,
}) => {
  const navigate = useNavigate();

  const color = gameType === "sam" ? "cyan" : "pink";
  const title = gameType === "sam" ? "SÂM" : "PHỎM";

  const playerSlots = Array.from({ length: 4 }).map((_, i) => {
    const player = players[i];
    return (
      <div
        key={i}
        className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl border border-${color}-500/60 bg-gray-900/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm`}
      >
        {player ? (
          <>
            <img
              src={player.avatar || "/assets/default-avatar.png"}
              alt={player.name}
              className="w-16 h-16 rounded-full border border-cyan-400 mb-2"
            />
            <p className="text-cyan-300 font-mono text-sm">{player.name}</p>
          </>
        ) : (
          <NeonButton
            color={color}
            size="sm"
            className="rounded-full w-10 h-10 flex items-center justify-center text-lg font-mono"
            onClick={() => console.log("Invite player")}
          >
            +
          </NeonButton>
        )}
      </div>
    );
  });

  return (
    <CyberpunkLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 px-4">

        <div className="absolute bottom-6 left-6 opacity-80">
          <Dice3D />
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl font-mono text-${color}-300 glitch-text mb-2`}>
            {title} WAITING ROOM
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            Room ID: <span className={`text-${color}-400`}>{roomId}</span> · Host ID:{" "}
            <span className={`text-${color}-400`}>{hostId || "—"}</span>
          </p>
        </div>

        <div className="flex justify-center items-center gap-6 flex-wrap mb-12">
          {playerSlots}
        </div>

        <p className="text-gray-400 font-mono italic animate-pulse text-center mb-10">
          Waiting for other players...
        </p>

        {isHost && (
          <NeonButton
            color={color}
            size="lg"
            className="rounded-full px-10 py-4 font-mono text-lg"
            onClick={() => {
              console.log("Start Game");
              onStart?.();
            }}
          >
            START GAME
          </NeonButton>
        )}

        <button
          onClick={() => {
            onLeave?.();
            navigate("/welcome");
          }}
          className={`absolute bottom-6 right-6 px-6 py-2 border border-${color}-500/60 text-${color}-300 font-mono rounded-full text-sm hover:bg-${color}-500/10 transition`}
        >
          Exit Game
        </button>

        <style>{`
          @keyframes glitch {
            0% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.7), -0.05em -0.025em 0 rgba(0,255,0,0.7); }
            50% { text-shadow: -0.05em 0.025em 0 rgba(255,0,0,0.7), 0.025em 0.05em 0 rgba(0,255,0,0.7); }
            100% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.7), -0.025em 0 0 rgba(0,255,0,0.7); }
          }
          .glitch-text { animation: glitch 1.5s infinite; }
        `}</style>
      </div>
    </CyberpunkLayout>
  );
};

export default WaitingRoom;