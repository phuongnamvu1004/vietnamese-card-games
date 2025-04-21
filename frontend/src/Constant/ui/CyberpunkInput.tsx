import React from "react";

interface CyberpunkInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const CyberpunkInput: React.FC<CyberpunkInputProps> = ({
  id,
  name,
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  minLength,
  onChange,
  onFocus,
  onBlur,
  isFocused = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}) => {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
      >
        {label}
      </label>
      <div
        className={`relative border ${isFocused ? "border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]" : "border-gray-700"} rounded-md bg-gray-800/50 transition-all duration-300`}
      >
        <input
          type={showPassword ? "text" : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono ${showPasswordToggle ? "pr-16" : ""}`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm font-mono focus:outline-none"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}

        {isFocused && (
          <div className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
        )}
      </div>
    </div>
  );
};

export default CyberpunkInput;
