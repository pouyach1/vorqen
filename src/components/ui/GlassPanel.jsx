const GLOW = {
  cyan: "shadow-neon-cyan border-cyan-neon/30",
  purple: "shadow-neon-purple border-purple-neon/30",
  magenta: "shadow-neon-magenta border-magenta-neon/30",
  emerald: "shadow-neon-emerald border-emerald-neon/30",
};

export default function GlassPanel({ as: Tag = "div", glow = "cyan", className = "", children, ...rest }) {
  return (
    <Tag
      className={`glass-panel border ${GLOW[glow] ?? GLOW.cyan} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
