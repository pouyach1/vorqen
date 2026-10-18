const STATUS_CONFIG = {
  running: { label: "ONLINE 24/7", color: "bg-emerald-neon", text: "text-emerald-neon" },
  paused: { label: "PAUSED", color: "bg-amber-400", text: "text-amber-300" },
  error: { label: "ISSUE DETECTED", color: "bg-magenta-neon", text: "text-magenta-neon" },
};

/**
 * `liveStatus` (running/paused/error) comes from useLiveBotStats — when
 * absent (Supabase not connected, or no matching row), this quietly falls
 * back to the original static "ONLINE 24/7" look.
 */
export default function StatusDot({ label, liveStatus }) {
  const config = STATUS_CONFIG[liveStatus] ?? STATUS_CONFIG.running;
  const displayLabel = label ?? config.label;

  return (
    <span className={`inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest ${config.text}`}>
      <span className="relative flex h-2.5 w-2.5">
        {liveStatus !== "error" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.color}`} />
      </span>
      {displayLabel}
    </span>
  );
}
