import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Layout/Navbar";
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout";
import Neonbutton from "../Components/ui/Neonbutton";
import { axiosInstance } from "../lib/axios";

const Game: React.FC = () => {
  const [user, setUser] = useState<null | {
    fullName: string;
    profilePicture: string;
  }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/check");
        setUser({
          fullName: res.data.fullName,
          profilePicture: res.data.profilePic || "/assets/default-avatar.png",
        });
      } catch (error) {
        console.error("Not authenticated:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <CyberpunkLayout>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-8 pt-24">
        {/* Title */}
        <h1 className="text-3xl font-mono text-cyan-300 glitch-text mb-8">
          CHOOSE YOUR GAME
        </h1>

        {/* Game Mode Buttons */}
        <div className="flex flex-col gap-8 w-80">
          <Neonbutton to="/game/sam" color="cyan" fullWidth size="lg">
            Play Sâm
          </Neonbutton>

          <Neonbutton to="/game/phom" color="pink" fullWidth size="lg">
            Play Phỏm
          </Neonbutton>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 w-full text-center text-cyan-400 font-mono text-sm">
          / ENJOY THE TRADITIONAL VIETNAMESE CARD EXPERIENCE /
        </div>
      </div>

      {/* Glitch Text Effect */}
      <style>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255,0,0,0.7), -0.05em -0.025em 0 rgba(0,255,0,0.7), -0.025em 0.05em 0 rgba(0,0,255,0.7);
          }
          15% {
            text-shadow: -0.05em 0.025em 0 rgba(255,0,0,0.7), 0.025em 0.05em 0 rgba(0,255,0,0.7), 0.05em -0.05em 0 rgba(0,0,255,0.7);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.7), 0.05em 0 0 rgba(0,255,0,0.7), 0 -0.05em 0 rgba(0,0,255,0.7);
          }
          100% {
            text-shadow: -0.025em -0.05em 0 rgba(255,0,0,0.7), 0.025em 0.05em 0 rgba(0,255,0,0.7), -0.05em 0 0 rgba(0,0,255,0.7);
          }
        }

        .glitch-text {
          animation: glitch 1.5s infinite;
        }
      `}</style>
    </CyberpunkLayout>
  );
};

export default Game;
