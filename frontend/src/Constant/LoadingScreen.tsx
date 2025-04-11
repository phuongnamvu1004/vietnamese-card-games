import React from 'react';

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({text = "LOADING SYSTEM"}) => {
  return (
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
          {text}
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                style={{animationDelay: '0.3s'}}></span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;