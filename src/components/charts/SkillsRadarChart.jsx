import { useState } from "react";
import { motion } from "framer-motion";

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 118;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointFor(angle, fraction) {
  const x = CENTER + Math.cos(angle) * RADIUS * fraction;
  const y = CENTER + Math.sin(angle) * RADIUS * fraction;
  return [x, y];
}

export default function SkillsRadarChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const angleStep = (Math.PI * 2) / data.length;
  const startAngle = -Math.PI / 2;

  const dataPoints = data.map((d, i) => {
    const angle = startAngle + i * angleStep;
    return { ...d, angle, point: pointFor(angle, d.value / 100) };
  });

  const polygonPoints = dataPoints.map((d) => d.point.join(",")).join(" ");

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full overflow-visible">
        {/* Grid rings */}
        {RINGS.map((fraction) => {
          const ringPoints = dataPoints
            .map((d) => pointFor(d.angle, fraction).join(","))
            .join(" ");
          return (
            <polygon
              key={fraction}
              points={ringPoints}
              fill="none"
              stroke="#1e293b"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis spokes */}
        {dataPoints.map((d) => {
          const [x, y] = pointFor(d.angle, 1);
          return (
            <line
              key={d.axis}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#1e293b"
              strokeWidth={1}
            />
          );
        })}

        {/* Animated data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="#00f3ff"
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7000ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity={0.15} />
          </radialGradient>
        </defs>

        {/* Vertex dots (hoverable) */}
        {dataPoints.map((d, i) => (
          <circle
            key={d.axis}
            cx={d.point[0]}
            cy={d.point[1]}
            r={5}
            fill="#030712"
            stroke="#00f3ff"
            strokeWidth={2}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Axis labels */}
        {dataPoints.map((d) => {
          const [lx, ly] = pointFor(d.angle, 1.28);
          const anchor = Math.cos(d.angle) > 0.15 ? "start" : Math.cos(d.angle) < -0.15 ? "end" : "middle";
          return (
            <text
              key={d.axis}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-slate-400 font-heading"
              fontSize={11}
            >
              {d.axis}
            </text>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute rounded-lg border border-cyan-neon/40 bg-void/90 px-2.5 py-1 text-xs text-cyan-neon shadow-neon-cyan"
          style={{
            left: `${(dataPoints[hovered].point[0] / SIZE) * 100}%`,
            top: `${(dataPoints[hovered].point[1] / SIZE) * 100}%`,
            transform: "translate(-50%, -140%)",
          }}
        >
          {dataPoints[hovered].axis}: {dataPoints[hovered].value}%
        </div>
      )}
    </div>
  );
}
