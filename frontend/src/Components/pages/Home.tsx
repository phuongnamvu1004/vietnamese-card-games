import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


interface HomeProps {
  onEnter?: () => void;
}

const Home: React.FC<HomeProps> = ({onEnter}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Card animation
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidde bg-gray-900">

      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20"></div>

      <div className="absolute inset-0 opacity-10 bg-repeat"
           style={{
             backgroundImage: `url('/textures/grid-pattern.png')`,
             backgroundSize: '100px 100px'
           }}>
      </div>

      <div className="absolute top-0 w-full h-2 bg-cyan-500 shadow-[0_0_20px_5px_rgba(6,182,212,0.7)]"></div>
      <div className="absolute bottom-0 w-full h-2 bg-pink-500 shadow-[0_0_20px_5px_rgba(236,72,153,0.7)]"></div>

      {/* Header with futuristic logo */}
      <div className="absolute top-8 w-full flex justify-center">
        <div className="text-center">
          <div
            className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            VIETNAMESE CARD GAME
          </div>
        </div>
      </div>

      {/* Holographic card table */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-[50%] bg-blue-900/30 border border-cyan-500/50 shadow-[0_0_40px_5px_rgba(6,182,212,0.3)] backdrop-blur-sm">
        {/* Digital noise texture */}
        <div className="absolute inset-0 opacity-5 bg-repeat mix-blend-overlay"
             style={{backgroundImage: `url('/textures/digital-noise.png')`}}>
        </div>

        {/* Holographic projection lines */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>

        {/* Cyberpunk-style cards */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex justify-center">
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
                 className={`relative bg-gray-900 rounded-lg border border-gray-700 shadow-lg flex items-center justify-center w-24 h-36 ${hoveredCard === index ? 'z-20' : 'z-10'}`}
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
                className={`text-transparent bg-clip-text bg-gradient-to-br ${item.primaryColor} ${item.secondaryColor} text-4xl font-bold`}>
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

      {/* Main content */}
      <div className="relative z-10 pt-32 flex flex-col items-center justify-center h-screen">
        <div className="relative mb-12 mt-8">
          <p className="mt-4 text-cyan-300 text-xl item-center font-medium font-mono tracking-wider glitch-text">
            TRADITIONAL GAME
          </p>
        </div>

        {/* Neon buttons */}
        <div className="flex flex-col gap-5 w-80">
          <Link to="/login"
                className="relative overflow-hidden py-4 px-6 rounded-md bg-gray-900 text-center text-cyan-400 text-xl font-bold uppercase tracking-wider shadow-lg border border-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transform hover:-translate-y-1 transition-all font-mono">
            <span className="relative z-10">LOGIN</span>
            <span
              className="absolute inset-0 bg-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity"></span>
          </Link>

          <Link to="/signup"
                className="relative overflow-hidden py-4 px-6 rounded-md bg-gray-900 text-center text-pink-400 text-xl font-bold uppercase tracking-wider shadow-lg border border-pink-500 hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transform hover:-translate-y-1 transition-all font-mono">
            <span className="relative z-10">SIGN UP</span>
            <span
              className="absolute inset-0 bg-pink-500/20 opacity-0 hover:opacity-100 transition-opacity"></span>
          </Link>
        </div>
        <div className="absolute bottom-6 text-center">
          <p className="text-cyan-300/80 text-sm font-medium font-mono tracking-wider">
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
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse"
                    style={{animationDuration: '1.5s', animationDelay: `${index * 0.2}s`}}></div>
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
                    style={{animationDelay: '0.3s'}}></span>
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
      `}</style>
    </div>
  );
};

export default Home;