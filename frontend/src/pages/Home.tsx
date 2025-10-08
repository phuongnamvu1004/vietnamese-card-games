import React, { useEffect, useState } from "react";
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout";
import Logo from "../Components/ui/Logo";
import Neonbutton from "../Components/ui/NeonButton.tsx";
import PokerChip from "../Components/ui/PokerChip";
import CardFan from "../Components/ui/CardFan"; // 🆕 thêm
import Dice3D from "../Components/ui/Dice";   // 🆕 thêm

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const chips = [
    { value: "1000", color: "bg-red-600", borderColor: "border-red-400", textColor: "text-white", shadow: "rgba(239,68,68,0.7)" },
    { value: "5000", color: "bg-blue-600", borderColor: "border-blue-400", textColor: "text-white", shadow: "rgba(37,99,235,0.7)" },
    { value: "10000", color: "bg-gray-900", borderColor: "border-gray-700", textColor: "text-gray-300", shadow: "rgba(24,24,27,0.7)" },
    { value: "25000", color: "bg-gray-100", borderColor: "border-gray-300", textColor: "text-gray-900", shadow: "rgba(243,244,246,0.7)" },
  ];

  const chipPositions = [
    { top: "15%", left: "5%", rotate: "15deg" },
    { top: "75%", left: "7%", rotate: "-10deg" },
    { top: "25%", left: "30%", rotate: "20deg" },
    { top: "65%", left: "28%", rotate: "-15deg" },
  ];

  return (
    <CyberpunkLayout isLoading={isLoading}>
      {/* Logo */}
      <Logo />

      {/* Background grid & lines */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat mix-blend-overlay"
        style={{ backgroundImage: `url('/textures/digital-noise.png')` }}
      ></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>

      {/* Poker Chips */}
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

      <div className="relative z-10 flex h-screen pt-24">
        {/* LEFT SECTION */}
        <div className="w-1/2 flex flex-col justify-center items-start pl-20 pr-10">
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            / FUTURISTIC VIETNAMESE GAMING EXPERIENCE /
          </h1>
          <p className="mt-4 text-cyan-300 text-2xl font-medium font-mono tracking-wider glitch-text">
            TRADITIONAL GAMES
          </p>

          <div className="flex flex-col gap-6 w-96 mt-16">
            <Neonbutton to="/login" color="cyan" fullWidth size="lg">
              LOGIN
            </Neonbutton>
            <Neonbutton to="/signup" color="pink" fullWidth size="lg">
              SIGN UP
            </Neonbutton>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-1/2 flex items-center justify-center relative pr-20">
          {/* Neon border frame */}
          <div
            className="absolute inset-y-1/4 inset-x-1/4 border-2 border-cyan-500/50 p-4 rounded-xl neon-flicker"
            style={{
              boxShadow: "0 0 30px rgba(6,182,212,0.4)",
              transform: "rotate(-5deg)",
            }}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>
          </div>

          {/* Card Fan (bộ bài xoè) */}
          <div className="relative z-10 transform scale-110 rotate-3 hover:scale-115 transition-transform duration-500 animate-float">
            <CardFan />
          </div>

          {/* Dice (đặt bên cạnh) */}
          <div className="absolute bottom-10 right-0 drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]">
            <Dice3D />
          </div>
        </div>
      </div>

      {/* Effects */}
      <style>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                        -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14%, 100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                        -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15%, 49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                        0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                        0.05em 0 0 rgba(0, 255, 0, 0.75),
                        0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
        .glitch-text {
          animation: glitch 1s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.6; }
        }
        .neon-flicker {
          animation: flicker 3s infinite;
        }
      `}</style>
    </CyberpunkLayout>
  );
};

export default Home;
