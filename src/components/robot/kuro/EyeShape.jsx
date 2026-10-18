import { MOODS } from "./moods";

export default function EyeShape({ mood, side, look }) {
  const cfg = MOODS[mood];
  const mirror = side === "right" ? -1 : 1;
  const shiftX = look.x * 3 * mirror * -1;
  const shiftY = look.y * 2;

  if (cfg.eye === "circle") {
    return (
      <svg viewBox="0 0 60 44" width="46" height="34" style={{ overflow: "visible" }}>
        <circle
          cx={30 + shiftX}
          cy={22 + shiftY}
          r="13"
          fill="none"
          stroke={cfg.accent}
          strokeWidth="5.5"
          style={{ filter: `drop-shadow(0 0 8px ${cfg.glow})` }}
        />
        <circle cx={30 + shiftX * 1.4} cy={22 + shiftY * 1.4} r="3.2" fill={cfg.accent} opacity="0.9" />
      </svg>
    );
  }

  if (cfg.eye === "heart") {
    return (
      <svg viewBox="0 0 60 44" width="42" height="32" style={{ overflow: "visible" }}>
        <path
          d="M30,34 C15,23 9,12 18,7 C24,4 30,9 30,13 C30,9 36,4 42,7 C51,12 45,23 30,34 Z"
          fill={cfg.accent}
          style={{ filter: `drop-shadow(0 0 10px ${cfg.glow})` }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 60 44"
      width="46"
      height="34"
      style={{ overflow: "visible", transform: `translate(${shiftX}px, ${shiftY}px)` }}
    >
      <path
        d={cfg.eye}
        fill="none"
        stroke={cfg.accent}
        strokeWidth="6"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${cfg.glow})` }}
      />
    </svg>
  );
}
