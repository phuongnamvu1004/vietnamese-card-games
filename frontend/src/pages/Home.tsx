import { UserAPI } from "../api/UserApi";
import React, { useEffect, useState } from "react";
import CyberpunkLayout from "../components/Layout/CyberpunkLayout.tsx";
import Logo from "../components/ui/Logo.tsx";
import Neonbutton from "../components/ui/NeonButton.tsx";
import PokerChip from "../components/ui/PokerChip.tsx";
import CardFan from "../components/ui/card/CardFan.tsx";
import Dice3D from "../components/ui/Dice.tsx";
import Coin from "../components/ui/Coin.tsx";
import LoginToast from "../components/ui/LoginToast.tsx";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await UserAPI.refreshToken();
      if (token) {
        try {
          const res = await UserAPI.getProfile();
          setUser(res.data);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
    setIsLoading(false);
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
    { top: "65%", left: "35%", rotate: "-15deg" },
  ];

  return (
    <CyberpunkLayout isLoading={isLoading}>
      {user && <LoginToast />}
      <Logo />

      <div
        className="absolute inset-0 opacity-5 bg-repeat mix-blend-overlay"
        style={{ backgroundImage: `url('/textures/digital-noise.png')` }}
      ></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>

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
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-8 ml-18 tracking-wide drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            / FUTURISTIC VIETNAMESE GAMING EXPERIENCE /
          </h1>
          <p className="mt-4 text-cyan-300 text-2xl font-medium font-mono tracking-wider glitch-text ml-48">
            *TRADITIONAL GAMES*
          </p>

          {user ? (
            <div className="mt-16 ml-40 w-[380px] p-4 rounded-lg border border-amber-400/50 bg-amber-900/20 backdrop-blur-md shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-fadeIn">
              <h2 className="text-amber-300 text-2xl font-bold font-mono mb-2">
                Welcome back, {user?.fullName || "Player"}! 🎮
              </h2>
              <p className="text-amber-200 text-lg font-mono leading-relaxed mb-4">
                You’re now logged in — enjoy exploring Vietnam’s traditional card games with us!
              </p>
              <Neonbutton
                to="/welcome"
                color="cyan"
                size="sm"
                className="mt-2 font-bold tracking-wide px-4 py-2 rounded-md text-sm hover:brightness-110 active:scale-95 transition-all"
              >
                START PLAYING
              </Neonbutton>
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-96 mt-16 ml-40">
              <Neonbutton to="/login" color="cyan" fullWidth size="lg">
                LOGIN
              </Neonbutton>
              <Neonbutton to="/signup" color="pink" fullWidth size="lg">
                SIGN UP
              </Neonbutton>
            </div>
          )}
        </div>

        <div className="w-1/2 flex items-center justify-center relative pr-20">
          <div className="absolute inset-0 flex justify-center items-center translate-y-[-40px]">
            <div className="absolute w-[420px] h-[270px] bg-cyan-400/20 blur-3xl rounded-full animate-pulse"></div>
            <Coin style={{ top: "5%", left: "20%", position: "absolute" }} size={80} />
            <Coin style={{ top: "20%", right: "10%", position: "absolute" }} size={90} />
            <Coin style={{ bottom: "10%", left: "15%", position: "absolute" }} size={70} />
            <Coin style={{ bottom: "20%", right: "20%", position: "absolute" }} size={100} />
            <Coin style={{ top: "50%", left: "0%", position: "absolute" }} size={60} />
            <div className="relative z-10 transform scale-125 rotate-2 hover:scale-130 transition-transform duration-500 animate-float">
              <CardFan />
            </div>
          </div>

          <div className="absolute bottom-12 right-12 drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]">
            <Dice3D />
          </div>
        </div>
      </div>

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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </CyberpunkLayout>
  );
};

export default Home;
