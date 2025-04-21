/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(3deg)" },
          "50%": { transform: "translateY(-10px) rotate(5deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(-3deg)" },
          "50%": { transform: "translateY(-10px) rotate(-6deg)" },
        },
        pulse: {
          "0%": { opacity: 0.5, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1.1)" },
        },
        glow: {
          "0%, 100%": {
            textShadow:
              "0 0 15px rgba(255, 0, 54, 0.7), 0 0 30px rgba(255, 0, 54, 0.3)",
          },
          "50%": {
            textShadow:
              "0 0 25px rgba(0, 168, 255, 0.9), 0 0 40px rgba(0, 168, 255, 0.5)",
          },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        pulse: "pulse 2s infinite alternate",
        glow: "glow 3s infinite alternate",
      },
    },
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".transform-style-3d": {
          "transform-style": "preserve-3d",
        },
        ".perspective": {
          perspective: "1000px",
        },
        ".group-hover\\:rotate-y-180": {
          "@variants group-hover": {
            transform: "rotateY(180deg)",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover", "group-hover"]);
    },
  ],
  // DaisyUI theme config
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ff0000",
          secondary: "#f97316",
          accent: "#1dcdbc",
          neutral: "#2b3440",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
