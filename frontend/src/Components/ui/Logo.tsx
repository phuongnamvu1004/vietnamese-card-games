import React from "react";

interface LogoProps {
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center"; // thêm prop align
}

const Logo: React.FC<LogoProps> = ({ subtitle, size = "lg", align = "center" }) => {
  const textSize = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  }[size];

  return (
    <div
      className={
        align === "center"
          ? "absolute top-8 w-full flex justify-center"
          : "flex justify-start"
      }
    >
      <div className="text-center">
        <div
          className={`font-mono ${textSize} font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]`}
        >
          VIETNAMESE CARD GAME
        </div>
        {subtitle && (
          <div className="font-mono text-lg mt-2 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;