import React, { ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

interface CyberpunkLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

const CyberpunkLayout: React.FC<CyberpunkLayoutProps> = ({
  children,
  isLoading = false,
  loadingText = "LOADING SYSTEM",
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20"></div>

      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `url('/textures/grid-pattern.png')`,
          backgroundSize: "100px 100px",
        }}
      ></div>

      {/* Top and bottom borders */}
      <div className="absolute top-0 w-full h-2 bg-cyan-500 shadow-[0_0_20px_5px_rgba(6,182,212,0.7)]"></div>
      <div className="absolute bottom-0 w-full h-2 bg-pink-500 shadow-[0_0_20px_5px_rgba(236,72,153,0.7)]"></div>

      {/* Main content */}
      {children}

      {/* Cyberpunk loading effect */}
      {isLoading && <LoadingScreen text={loadingText} />}
    </div>
  );
};

export default CyberpunkLayout;
