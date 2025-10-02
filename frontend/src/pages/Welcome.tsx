import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Layout/Navbar.tsx";
import { axiosInstance } from "../lib/axios.ts"; // Adjust the path based on your project structure
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout.tsx";
import NeonButton from "../Components/ui/NeonButton.tsx";
import PokerChip from "../Components/ui/PokerChip";

const Game: React.FC = () => {
  const [, setUser] = useState<null | {
    fullName: string;
    profilePicture: string;
  }>(null);
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);

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

  const chips = [
    { value: "1000", color: "bg-red-600", borderColor: "border-red-400", textColor: "text-white", shadow: "rgba(239,68,68,0.7)" },
    { value: "5000", color: "bg-blue-600", borderColor: "border-blue-400", textColor: "text-white", shadow: "rgba(37,99,235,0.7)" },
    { value: "10000", color: "bg-gray-900", borderColor: "border-gray-700", textColor: "text-gray-300", shadow: "rgba(24,24,27,0.7)" },
    { value: "25000", color: "bg-gray-100", borderColor: "border-gray-300", textColor: "text-gray-900", shadow: "rgba(243,244,246,0.7)" },
  ];

  const chipPositions = [
    { top: "15%", left: "5%", rotate: "15deg" },
    { top: "75%", left: "7%", rotate: "-10deg" },
    { top: "25%", right: "6%", rotate: "20deg" },
    { top: "65%", right: "8%", rotate: "-15deg" },
  ];

  const cards = [
    { card: "A♥", primaryColor: "from-pink-500", secondaryColor: "to-purple-500", transform: "rotate(-15deg)" },
    { card: "K♠", primaryColor: "from-blue-500", secondaryColor: "to-cyan-500", transform: "rotate(-5deg)" },
    { card: "Q♦", primaryColor: "from-pink-500", secondaryColor: "to-purple-500", transform: "rotate(5deg)" },
    { card: "J♣", primaryColor: "from-blue-500", secondaryColor: "to-cyan-500", transform: "rotate(15deg)" },
  ];

  return (
    <CyberpunkLayout>
      <Navbar />
      
      {/* Background elements from Home.tsx */}
      {chips.map((chip, index) => (
        <PokerChip
          key={index}
          index={index}
          value={chip.value}
          color={chip.color}
          borderColor={chip.borderColor}
          textColor={chip.textColor}
          shadow={chip.shadow}
          position={chipPositions[index]}
          isHovered={hoveredChip === index}
          onHover={() => setHoveredChip(index)}
          onLeave={() => setHoveredChip(null)}
        />
      ))}

      {/* Card Table */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-[50%] bg-blue-900/30 border border-cyan-500/50 shadow-[0_0_40px_5px_rgba(6,182,212,0.3)] backdrop-blur-sm">
        <div className="absolute inset-0 opacity-5 bg-repeat mix-blend-overlay" style={{ backgroundImage: `url('/textures/digital-noise.png')` }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>

        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex justify-center">
          {cards.map((item, index) => (
            <div
              key={index}
              className={`relative bg-gray-900 rounded-lg border border-gray-700 shadow-lg flex items-center justify-center w-32 h-48 ${hoveredCard === index ? "z-20" : "z-10"}`}
              style={{
                transform: `${item.transform} translateY(${hoveredCard === index ? "-30px" : "0px"})`,
                transition: "all 0.3s ease",
                marginLeft: index > 0 ? "-30px" : "0",
                boxShadow: hoveredCard === index ? `0 0 30px 5px rgba(6,182,212,0.7)` : ""
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-[2px] rounded-md bg-gradient-to-br ${item.primaryColor} ${item.secondaryColor} opacity-20`}></div>
              <span className={`text-transparent bg-clip-text bg-gradient-to-br ${item.primaryColor} ${item.secondaryColor} text-5xl font-bold`}>
                {item.card}
              </span>
              {hoveredCard === index && <div className="absolute -inset-px rounded-lg animate-pulse border border-cyan-500"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (from welcomepage.tsx) */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 gap-8 pt-24">
        <h1 className="text-3xl font-mono text-cyan-300 glitch-text mb-8">
          CHOOSE YOUR GAME
        </h1>

        <div className="flex flex-col gap-8 w-80">
          <NeonButton to="/game/sam" color="cyan" fullWidth size="lg">
            Play Sâm
          </NeonButton>

          <NeonButton to="/game/phom" color="pink" fullWidth size="lg">
            Play Phỏm
          </NeonButton>
        </div>

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