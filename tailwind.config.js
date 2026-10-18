/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#030712",
        panel: "rgba(15, 23, 42, 0.65)",
        cyan: {
          neon: "#00f3ff",
        },
        purple: {
          neon: "#7000ff",
        },
        magenta: {
          neon: "#ff007f",
        },
        emerald: {
          neon: "#00ff88",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        heading: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 5px #00f3ff, 0 0 20px rgba(0,243,255,0.35)",
        "neon-purple": "0 0 5px #7000ff, 0 0 20px rgba(112,0,255,0.35)",
        "neon-magenta": "0 0 5px #ff007f, 0 0 20px rgba(255,0,127,0.35)",
        "neon-emerald": "0 0 5px #00ff88, 0 0 20px rgba(0,255,136,0.35)",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(0,243,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.08) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "grid-shift": "grid-shift 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "grid-shift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "80px 80px" },
        },
      },
    },
  },
  plugins: [],
};
