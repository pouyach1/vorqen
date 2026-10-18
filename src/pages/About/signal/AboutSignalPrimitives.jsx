/** Shared SIGNAL geometry — brand cyan/purple, no yellow. Lightweight SVG/CSS only. */

export function SignalCore({ className = "", size = 16 }) {
  return (
    <span
      data-signal="core"
      className={`inline-block rounded-full bg-cyan-neon shadow-neon-cyan ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

export function SignalRing({ className = "" }) {
  return (
    <span
      data-signal="ring"
      className={`block rounded-full border border-cyan-neon/45 ${className}`}
      aria-hidden
    />
  );
}

export function SignalCross({ className = "", span = "min(55vw,420px)" }) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      aria-hidden
      style={{ width: span, height: span }}
    >
      <span
        data-signal="ray"
        className="absolute left-0 top-1/2 h-px w-full origin-center bg-gradient-to-r from-transparent via-cyan-neon/70 to-transparent"
      />
      <span
        data-signal="ray"
        className="absolute left-1/2 top-0 h-full w-px origin-center bg-gradient-to-b from-transparent via-purple-neon/60 to-transparent"
      />
    </span>
  );
}

export function SignalTick({ className = "", label }) {
  return (
    <span
      data-signal="tick"
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-neon/70 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-neon" aria-hidden />
      {label}
    </span>
  );
}

export function SignalGrid({ className = "", id = "about-signal-grid" }) {
  return (
    <svg
      data-signal="grid"
      className={`absolute inset-0 h-full w-full text-cyan-neon/25 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M72 0H0V72" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
