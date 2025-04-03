import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  onEnter?: () => void;
}

const Home: React.FC<HomeProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-1000 to-slate-900">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-repeat" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Card table effect */}
      <div className="absolute top-1/2 left-0 w-full h-3/5 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(9,42,32,0.5)_0%,rgba(9,42,32,0)_70%)]"></div>

      {/* Chips decoration */}
      <div className="absolute top-3/4 left-16 avatar animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-14 h-14 rounded-full ring ring-white ring-offset-2 shadow-lg rotate-12 bg-gradient-to-r from-red-500 to-pink-500"></div>
      </div>
      <div className="absolute top-20 right-16 avatar animate-float-slow" style={{ animationDelay: '1s' }}>
        <div className="w-14 h-14 rounded-full ring ring-white ring-offset-2 shadow-lg -rotate-12 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>
      <div className="absolute bottom-16 right-20 avatar animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-14 h-14 rounded-full ring ring-white ring-offset-2 shadow-lg rotate-6 bg-gradient-to-r from-green-400 to-teal-500"></div>
      </div>

      {/* Additional Chips */}
      <div className="absolute top-1/3 left-1/4 avatar animate-float-slow" style={{ animationDelay: '0.3s' }}>
        <div className="w-10 h-10 rounded-full ring ring-white ring-offset-1 shadow-lg rotate-12 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
      </div>
      <div className="absolute bottom-1/3 right-1/4 avatar animate-float" style={{ animationDelay: '0.8s' }}>
        <div className="w-10 h-10 rounded-full ring ring-white ring-offset-1 shadow-lg -rotate-12 bg-gradient-to-r from-indigo-400 to-violet-500"></div>
      </div>

      {/* Floating cards */}
      <div className="absolute top-24 right-24 flex gap-10">
        {['A♥', 'K♦', 'Q♣','J♠'].map((card, index) => (
          <div key={`top-${index}`} className="card w-20 h-28 bg-base-100 shadow-xl rotate-3 animate-float perspective group"
            style={{ animationDelay: `${index * 0.5}s` }}>
            <div className="card-body relative w-full h-full p-0 transition-transform duration-700 group-hover:rotate-y-180 transform-style-3d">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 border border-white/15 flex items-center justify-center backface-hidden">
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center backface-hidden rotate-y-180">
                <span className="font-bold text-3xl text-white">{card}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-24 left-24 flex gap-10">
        {['10♥', '9♦', '8♣'].map((card, index) => (
          <div key={`bottom-${index}`} className="card w-20 h-28 bg-base-100 shadow-xl -rotate-3 animate-float-slow perspective group"
            style={{ animationDelay: `${index * 0.5 + 0.2}s` }}>
            <div className="card-body relative w-full h-full p-0 transition-transform duration-700 group-hover:rotate-y-180 transform-style-3d">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 border border-white/15 flex items-center justify-center backface-hidden">
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center backface-hidden rotate-y-180">
                <span className="font-bold text-3xl text-white">{card}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Center content without card/box container */}
      <div className="relative z-10 max-w-md text-center">
        {/* Logo with enhanced effects */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-4 tracking-wide animate-glow">Vietnamese Card Game</h1>
        </div>

        {/* <h2 className="text-2xl font-medium text-rose-300 mb-4">Experience the thrill of traditional Vietnamese card games anytime, anywhere</h2> */}

        {/* Enhanced buttons with smoother gradients and effects */}
        <div className="flex flex-col gap-5 mb-4">
          <Link to="/login" className="btn py-4 px-10 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 border-none text-white text-lg font-semibold uppercase tracking-wide shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transform hover:-translate-y-1 transition-all">
            Login
          </Link>

          <Link to="/signup" className="btn py-4 px-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-none text-white text-lg font-semibold uppercase tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-1 transition-all">
            Sign Up
          </Link>

          {onEnter && (
            <button
              onClick={onEnter}
              className="btn py-4 px-10 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 border-none text-white text-lg font-bold uppercase tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-1 transition-all"
            >
              Play Now
            </button>
          )}
        </div>

        {/* Additional text with shadow effect */}
        <p className="text-white/60 text-sm mt-4">Experience the thrill of traditional Vietnamese card games anytime, anywhere</p>
      </div>

      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 15px rgba(255, 0, 54, 0.7), 0 0 30px rgba(255, 0, 54, 0.3); }
          50% { text-shadow: 0 0 25px rgba(0, 168, 255, 0.9), 0 0 40px rgba(0, 168, 255, 0.5); }
        }
        
        .animate-glow {
          animation: glow 3s infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Home;