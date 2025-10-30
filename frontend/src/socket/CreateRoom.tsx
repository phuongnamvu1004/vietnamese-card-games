import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomApi } from "../api/RoomApi";
import { useSocket } from "./SocketProvider";
import CyberpunkInput from "../components/ui/CyberpunkInput";
import NeonButton from "../components/ui/NeonButton";
import AuthFormLayout from "../components/ui/AuthFormLayout";
import CyberpunkLayout from "../components/Layout/CyberpunkLayout";

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const token = localStorage.getItem("token")!;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState<{
    gameType: "sam" | "phom";
    maxPlayers: number;
    buyIn: number;
    betUnit: number;
    players: string[];
  }>({
    gameType: "sam",
    maxPlayers: 4,
    buyIn: 1000,
    betUnit: 100,
    players: [],
  });

  const [status, setStatus] = useState("");

  const handleCreate = async () => {
    try {
      setStatus("Creating room...");
      const data = await RoomApi.create(token, form);
      const roomId = data.roomId;

      if (!socket || !connected) throw new Error("Socket not connected");

      socket.emit(
        "joinRoom",
        {
          roomId,
          userId: user.id,
          playerName: user.fullName,
          buyIn: form.buyIn,
          gameBalance: user.balance,
        },
        (res) => {
          if (res.success) {
            setStatus("Joined room successfully!");
            navigate(`/room/${roomId}`, {
              state: { gameState: res.gameState, isHost: res.isHost },
            });
          } else setStatus(res.error || "Failed to join room");
        }
      );
    } catch (err: any) {
      setStatus(err.response?.data?.message || err.message);
    }
  };

  return (
    <CyberpunkLayout isLoading={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AuthFormLayout title="CREATE NEW ROOM">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-mono text-cyan-300">GAME TYPE</label>
              <select
                className="block w-full bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 px-4 py-3 mt-2 font-mono focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all"
                value={form.gameType}
                onChange={(e) =>
                  setForm({ ...form, gameType: e.target.value as "sam" | "phom" })
                }
              >
                <option value="sam">Sâm</option>
                <option value="phom">Phỏm</option>
              </select>
            </div>

            <CyberpunkInput
              id="maxPlayers"
              name="maxPlayers"
              label="MAX PLAYERS"
              type="number"
              value={String(form.maxPlayers)}
              onChange={(e) =>
                setForm({ ...form, maxPlayers: parseInt(e.target.value) })
              }
            />

            <CyberpunkInput
              id="buyIn"
              name="buyIn"
              label="BUY-IN AMOUNT"
              type="number"
              value={String(form.buyIn)}
              onChange={(e) =>
                setForm({ ...form, buyIn: parseInt(e.target.value) })
              }
            />

            <CyberpunkInput
              id="betUnit"
              name="betUnit"
              label="BET UNIT"
              type="number"
              value={String(form.betUnit)}
              onChange={(e) =>
                setForm({ ...form, betUnit: parseInt(e.target.value) })
              }
            />

            <NeonButton
              color="cyan"
              fullWidth
              onClick={handleCreate}
              disabled={!connected}
            >
              {connected ? "CREATE ROOM" : "CONNECTING..."}
            </NeonButton>

            {status && (
              <p
                className={`text-center font-mono text-sm ${
                  status.includes("success")
                    ? "text-cyan-400"
                    : "text-pink-400"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </AuthFormLayout>
      </div>
    </CyberpunkLayout>
  );
};

export default CreateRoom;
