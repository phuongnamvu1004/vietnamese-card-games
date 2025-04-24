import React, { ReactNode } from "react";

interface AuthFormLayoutProps {
  title: string;
  children: ReactNode;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ title, children }) => {
  return (
    <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          {title}
        </h2>
        {children}
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-pink-500"></div>
    </div>
  );
};

export default AuthFormLayout;
