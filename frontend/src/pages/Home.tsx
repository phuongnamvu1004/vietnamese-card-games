import React, { useEffect, useState } from "react";
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout";
import Logo from "../Components/ui/Logo";
import Neonbutton from "../Components/ui/NeonButton.tsx";
import PokerChip from "../Components/ui/PokerChip";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
    <CyberpunkLayout isLoading={isLoading}>
      <Logo />

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

      {/* Main Content */}
      <div className="relative z-10 pt-24 flex flex-col items-center justify-center h-screen">
        <div className="relative mb-12 mt-8">
          <p className="mt-4 text-cyan-300 text-2xl item-center font-medium font-mono tracking-wider glitch-text">
            TRADITIONAL GAME
          </p>
        </div>
        <div className="flex flex-col gap-6 w-96">
          <Neonbutton to="/login" color="cyan" fullWidth size="lg">LOGIN</Neonbutton>
          <Neonbutton to="/signup" color="pink" fullWidth size="lg">SIGN UP</Neonbutton>
        </div>
        <div className="absolute bottom-6 text-center">
          <p className="text-cyan-300/80 text-lg font-medium font-mono tracking-wider">
            / FUTURISTIC VIETNAMESE GAMING EXPERIENCE /
          </p>
        </div>
        <style>{`
        @keyframes glitch {
          0% {
         text-shadow:  0.05em 0 0 rgba(255, 0, 0, 0.75),
                      -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                      -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
        }
        14%, 100% {
        text-shadow:  -0.025em 0 0 rgba(255, 0, 0, 0.75),
                      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
        }
        15%, 49% {
        text-shadow:  -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
        }
        50% {
        text-shadow:  0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                      0.05em 0 0 rgba(0, 255, 0, 0.75),
                      0 -0.05em 0 rgba(0, 0, 255, 0.75);
        }
                      }
        .glitch-text {
        animation: glitch 1s infinite;
        }
        `}</style>
      </div>
    </CyberpunkLayout>
  );
};

export default Home;
