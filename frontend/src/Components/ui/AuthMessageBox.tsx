import React from "react";

interface AuthMessageBoxProps {
  type: "error" | "success";
  message: string;
}

const AuthMessageBox: React.FC<AuthMessageBoxProps> = ({ type, message }) => {
  const styleMap = {
    error: {
      border: "border-red-500",
      bg: "bg-red-500/10",
      text: "text-red-400",
      icon: "!",
    },
    success: {
      border: "border-green-500",
      bg: "bg-green-500/10",
      text: "text-green-400",
      icon: "✓",
    },
  }[type];

  return (
    <div className={`mb-6 p-3 border ${styleMap.border} ${styleMap.bg} rounded ${styleMap.text} text-sm font-mono`}>
      <div className="flex items-center">
        <span className="mr-2 text-lg">{styleMap.icon}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AuthMessageBox;
