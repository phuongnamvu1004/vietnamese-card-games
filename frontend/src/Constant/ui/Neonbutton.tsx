import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NeonButtonProps {
  to?: string;
  onClick?: () => void;
  color?: 'cyan' | 'pink' | 'purple';
  children: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({
                                                 to,
                                                 onClick,
                                                 color = 'cyan',
                                                 children,
                                                 fullWidth = false,
                                                 type = 'button',
                                                 disabled = false
                                               }) => {
  const colorStyles = {
    cyan: {
      text: 'text-cyan-400',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.7)]',
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/20'
    },
    pink: {
      text: 'text-pink-400',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]',
      border: 'border-pink-500',
      bg: 'bg-pink-500/20'
    },
    purple: {
      text: 'text-purple-400',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]',
      border: 'border-purple-500',
      bg: 'bg-purple-500/20'
    }
  }[color];

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `relative overflow-hidden py-3 px-6 rounded-md bg-gray-900 text-center ${colorStyles.text} text-xl font-bold uppercase tracking-wider shadow-lg ${colorStyles.border} hover:text-white ${colorStyles.hoverShadow} transform hover:-translate-y-1 transition-all font-mono ${widthClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  // Render link or button based on props
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        <span className="relative z-10">{children}</span>
        <span
          className={`absolute inset-0 ${colorStyles.bg} opacity-0 hover:opacity-100 transition-opacity`}></span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={buttonClasses}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute inset-0 ${colorStyles.bg} opacity-0 hover:opacity-100 transition-opacity`}></span>
    </button>
  );
};

export default NeonButton;