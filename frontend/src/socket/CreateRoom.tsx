import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RoomApi } from "../api/RoomApi";
import { useSocket } from "./SocketProvider";
import CyberpunkInput from "../components/ui/CyberpunkInput";
import NeonButton from "../components/ui/NeonButton";
import AuthFormLayout from "../components/ui/AuthFormLayout";
import CyberpunkLayout from "../components/layout/CyberpunkLayout";


const CreateRoom: React.FC = () => {
  const location = useLocation();
  const {connected } = useSocket();
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

  useEffect(() => {
    const newGameType = location.pathname.includes("phom") ? "phom" : "sam";
    setForm((prev) => ({ ...prev, gameType: newGameType }));
  }, [location.pathname]);

  const [status, setStatus] = useState("");

  const handleCreate = async () => {
    try {
      setStatus("Creating room...");
      console.log("Token being sent:", token);
      const data = await RoomApi.create(token, form);
      setStatus("Room created successfully!");
    } catch (err: any) {
      setStatus(err.response?.data?.message || err.message);
    }
  };

  return (
    <CyberpunkLayout isLoading={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AuthFormLayout title="CREATE NEW ROOM">
          <div className="space-y-5">
            <CyberpunkInput
              id="gameType"
              name="gameType"
              label="GAME TYPE"
              type="text"
              value={form.gameType}
              disabled
              onChange={() => {}}
            />

            <CyberpunkInput
              id="maxPlayers"
              name="maxPlayers"
              label="MAX PLAYERS "
              type="number"
              min={1}
              max={4}
              value={String(form.maxPlayers)}
              onChange={(e) =>
                setForm({ ...form, maxPlayers: Math.min(4, Math.max(1, parseInt(e.target.value))) 
                })
              }
            />

            <CyberpunkInput
              id="buyIn"
              name="buyIn"
              label="BUY-IN AMOUNT"
              type="number"
              step={10}
              value={String(form.buyIn)}
              onChange={(e) =>
                setForm({ ...form, buyIn: parseInt(e.target.value) 
                })
              }
            />

            <CyberpunkInput
              id="betUnit"
              name="betUnit"
              label="BET UNIT"
              type="number"
              step={10}
              value={String(form.betUnit)}
              onChange={(e) =>
                setForm({ ...form, betUnit: parseInt(e.target.value) })
              }
            />

            <CyberpunkInput
              id="players"
              name="players"
              label="INVITE PLAYER VIA EMAILS"
              type="text"
              placeholder="e.g. friend1@email.com, friend2@email.com"
              value={form.players.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  players: e.target.value
                    .split(",")
                    .map((email) => email.trim())
                    .filter((email) => email.length > 0),
                })
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
                className={`text-center font-mono text-sm ${status.includes("success")
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
