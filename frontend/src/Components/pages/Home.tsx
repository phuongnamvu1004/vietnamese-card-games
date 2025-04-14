import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  onEnter?: () => void;
}

const Home: React.FC<HomeProps> = ({ }) => {
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);

  // Poker chip colors and values
  const chips = [
    {
      value: '1000',
      color: 'bg-red-600',
      borderColor: 'border-red-400',
      textColor: 'text-white',
      shadow: 'rgba(239,68,68,0.7)'
    },
    {
      value: '5000',
      color: 'bg-blue-600',
      borderColor: 'border-blue-400',
      textColor: 'text-white',
      shadow: 'rgba(37,99,235,0.7)'
    },
    {
      value: '10000',
      color: 'bg-gray-900',
      borderColor: 'border-gray-700',
      textColor: 'text-gray-300',
      shadow: 'rgba(24,24,27,0.7)'
    },
    {
      value: '25000',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-900',
      shadow: 'rgba(243,244,246,0.7)'
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">

      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20"></div>

      <div className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `url('/textures/grid-pattern.png')`,
          backgroundSize: '100px 100px'
        }}>
      </div>

      <div className="absolute top-0 w-full h-2 bg-cyan-500 shadow-[0_0_20px_5px_rgba(6,182,212,0.7)]"></div>
      <div className="absolute bottom-0 w-full h-2 bg-pink-500 shadow-[0_0_20px_5px_rgba(236,72,153,0.7)]"></div>

      {/* CyberpunkLayout with futuristic logo */}
      <div className="absolute top-8 w-full flex justify-center">
        <div className="text-center">
          <div
            className="font-mono text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            VIETNAMESE CARD GAME
          </div>
        </div>
      </div>

      {/* Poker Chips scattered around the edges */}
      {chips.map((chip, index) => {
        // Calculate positions around the edge of the screen
        const positions = [
          { top: '15%', left: '5%', rotate: '15deg' },
          { top: '75%', left: '7%', rotate: '-10deg' },
          { top: '25%', right: '6%', rotate: '20deg' },
          { top: '65%', right: '8%', rotate: '-15deg' },
        ];

        const { top, left, right, rotate } = positions[index];

        return (
          <div
            key={`chip-${index}`}
            className={`absolute ${chip.color} w-20 h-20 rounded-full z-10 flex items-center justify-center cursor-pointer transform transition-all duration-300`}
            style={{
              top,
              left,
              right,
              transform: `rotate(${rotate}) ${hoveredChip === index ? 'scale(1.2)' : 'scale(1)'}`,
              boxShadow: hoveredChip === index ? `0 0 25px 5px ${chip.shadow}` : `0 0 15px 2px ${chip.shadow}`,
            }}
            onMouseEnter={() => setHoveredChip(index)}
            onMouseLeave={() => setHoveredChip(null)}
          >
            {/* Inner rings */}
            <div className={`absolute w-16 h-16 rounded-full border-2 ${chip.borderColor} opacity-70`}></div>
            <div className={`absolute w-14 h-14 rounded-full border ${chip.borderColor} opacity-40`}></div>
            <div className={`absolute w-12 h-12 rounded-full ${chip.borderColor} opacity-20`}></div>

            {/* Value text */}
            <span className={`relative z-20 font-mono font-bold ${chip.textColor} text-sm`}>{chip.value}</span>

            {/* Edge pattern */}
            <div className="absolute inset-0 rounded-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full ${chip.borderColor} opacity-80`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${i * 22.5}deg) translate(9.5px, 0)`,
                  }}
                ></div>
              ))}
            </div>

            {hoveredChip === index && (
              <div className="absolute inset-0 rounded-full animate-pulse opacity-50 border-2 border-white"></div>
            )}
          </div>
        );
      })}

      {/* Holographic card table - ENLARGED */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-[50%] bg-blue-900/30 border border-cyan-500/50 shadow-[0_0_40px_5px_rgba(6,182,212,0.3)] backdrop-blur-sm">
        {/* Digital noise texture */}
        <div className="absolute inset-0 opacity-5 bg-repeat mix-blend-overlay"
          style={{ backgroundImage: `url('/textures/digital-noise.png')` }}>
        </div>

        {/* Holographic projection lines */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>

        {/* Cyberpunk-style cards - ENLARGED and POSITIONED */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex justify-center">
          {[
            {
              card: 'A♥',
              primaryColor: 'from-pink-500',
              secondaryColor: 'to-purple-500',
              transform: 'rotate(-15deg)'
            },
            {
              card: 'K♠',
              primaryColor: 'from-blue-500',
              secondaryColor: 'to-cyan-500',
              transform: 'rotate(-5deg)'
            },
            {
              card: 'Q♦',
              primaryColor: 'from-pink-500',
              secondaryColor: 'to-purple-500',
              transform: 'rotate(5deg)'
            },
            {
              card: 'J♣',
              primaryColor: 'from-blue-500',
              secondaryColor: 'to-cyan-500',
              transform: 'rotate(15deg)'
            }
          ].map((item, index) => (
            <div key={index}
              className={`relative bg-gray-900 rounded-lg border border-gray-700 shadow-lg flex items-center justify-center w-32 h-48 ${hoveredCard === index ? 'z-20' : 'z-10'}`}
              style={{
                transform: `${item.transform} translateY(${hoveredCard === index ? '-30px' : '0px'})`,
                transition: 'all 0.3s ease',
                marginLeft: index > 0 ? '-30px' : '0',
                boxShadow: hoveredCard === index ? `0 0 30px 5px rgba(6,182,212,0.7)` : ''
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}>
              <div
                className={`absolute inset-[2px] rounded-md bg-gradient-to-br ${item.primaryColor} ${item.secondaryColor} opacity-20`}></div>
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-br ${item.primaryColor} ${item.secondaryColor} text-5xl font-bold`}>
                {item.card}
              </span>
              {hoveredCard === index && (
                <div
                  className="absolute -inset-px rounded-lg animate-pulse border border-cyan-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content - ENLARGED and RAISED */}
      <div className="relative z-10 pt-24 flex flex-col items-center justify-center h-screen">
        <div className="relative mb-12 mt-8">
          <p className="mt-4 text-cyan-300 text-2xl item-center font-medium font-mono tracking-wider glitch-text">
            TRADITIONAL GAME
          </p>
        </div>

        {/* Neon buttons - WIDER */}
        <div className="flex flex-col gap-6 w-96">
          <Link to="/login"
            className="relative overflow-hidden py-5 px-8 rounded-md bg-gray-900 text-center text-cyan-400 text-2xl font-bold uppercase tracking-wider shadow-lg border border-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transform hover:-translate-y-1 transition-all font-mono">
            <span className="relative z-10">LOGIN</span>
            <span
              className="absolute inset-0 bg-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity"></span>
          </Link>

          <Link to="/signup"
            className="relative overflow-hidden py-5 px-8 rounded-md bg-gray-900 text-center text-pink-400 text-2xl font-bold uppercase tracking-wider shadow-lg border border-pink-500 hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transform hover:-translate-y-1 transition-all font-mono">
            <span className="relative z-10">SIGN UP</span>
            <span
              className="absolute inset-0 bg-pink-500/20 opacity-0 hover:opacity-100 transition-opacity"></span>
          </Link>
        </div>
        <div className="absolute bottom-6 text-center">
          <p className="text-cyan-300/80 text-lg font-medium font-mono tracking-wider">
            / FUTURISTIC VIETNAMESE GAMING EXPERIENCE /
          </p>
        </div>
      </div>

      {/* Cyberpunk loading effect (optional) */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="relative">
            <div className="flex gap-2">
              {['A♥', 'K♠', 'Q♦', 'J♣'].map((card, index) => (
                <div key={index}
                  className="relative bg-gray-800 w-16 h-24 rounded-md flex items-center justify-center text-3xl font-bold border border-gray-700 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse"
                    style={{ animationDuration: '1.5s', animationDelay: `${index * 0.2}s` }}></div>
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-br ${index % 2 === 0 ? 'from-pink-400 to-purple-500' : 'from-cyan-400 to-blue-500'}`}>
                    {card}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-cyan-400 mt-6 text-center font-medium font-mono flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              LOADING SYSTEM
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                style={{ animationDelay: '0.3s' }}></span>
            </p>
          </div>
        </div>
      )}

      {/* Cyberpunk glitch effect CSS */}
      <style>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
        
        .glitch-text {
          animation: glitch 1s infinite;
        }
        
        @keyframes floatChip {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;