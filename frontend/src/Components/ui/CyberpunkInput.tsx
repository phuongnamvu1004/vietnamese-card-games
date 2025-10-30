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
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
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
  min,
  max,
  step,
  disabled = false,
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
      {/* Label */}
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
      >
        {label}
      </label>

      {/* Input Wrapper */}
      <div
        className={`relative border ${
          isFocused
            ? "border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
            : "border-gray-700"
        } rounded-md bg-gray-800/50 transition-all duration-300`}
      >
        {/* Input Field */}
        <input
          type={showPassword ? "text" : type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono
            ${showPasswordToggle ? "pr-16" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed text-gray-400" : ""}
          `}
        />

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm font-mono focus:outline-none"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}

        {/* Focus Glow Border */}
        {isFocused && (
          <div className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
        )}
      </div>
    </div>
  );
};

export default CyberpunkInput;