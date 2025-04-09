import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 w-full flex justify-center">
      <div className="w-full max-w-5xl h-24 flex items-center justify-between px-6">
        <h1
          className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          VIETNAMESE CARD GAME
        </h1>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 text-cyan-300 hover:text-cyan-400 transition-colors font-mono">TUTORIAL
          </button>
          <button className="px-4 py-2 text-cyan-300 hover:text-cyan-400 transition-colors font-mono">ABOUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;