import React, { useEffect, useState } from "react";

const LoginToast: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-cyan-700/70 border border-cyan-400/50 backdrop-blur-md px-6 py-3 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.7)] animate-fadeIn">
      <p className="text-white font-mono text-lg">🎮 Logged in successfully!</p>
    </div>
  );
};

export default LoginToast;