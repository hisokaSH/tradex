/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#080B0F",
          2: "#0D1117",
          3: "#111820",
          4: "#161E28",
        },
        red: {
          DEFAULT: "#FF3B3B",
          dim: "#cc2e2e",
          muted: "rgba(255,59,59,0.1)",
          border: "rgba(255,59,59,0.15)",
        },
        orange: "#FF6B35",
        green: {
          DEFAULT: "#00D97E",
          muted: "rgba(0,217,126,0.1)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          red: "rgba(255,59,59,0.15)",
        },
        txt: {
          DEFAULT: "#E8EDF3",
          2: "#8B96A3",
          3: "#4A5568",
        },
      },
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
        sans: ["'Syne'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
