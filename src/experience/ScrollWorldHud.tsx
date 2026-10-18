import { useEffect, useRef, useState } from "react";
import type { World } from "./core/world";
import { worldText } from "./i18n/worldCopy";

interface ScrollWorldHudProps {
  world: World | null;
}

export default function ScrollWorldHud({ world }: ScrollWorldHudProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const [connectDone, setConnectDone] = useState(false);

  // Type then fade "connecting to vorqen..."
  useEffect(() => {
    const full = worldText("connecting");
    const el = connectRef.current;
    if (!el) return undefined;

    let i = 0;
    let fadeRaf = 0;
    el.style.opacity = "1";
    el.textContent = "";

    const typeId = window.setInterval(() => {
      i += 1;
      el.textContent = full.slice(0, i);
      if (i >= full.length) {
        window.clearInterval(typeId);
        window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 900);
            el.style.opacity = String(1 - t);
            if (t < 1) fadeRaf = requestAnimationFrame(tick);
            else setConnectDone(true);
          };
          fadeRaf = requestAnimationFrame(tick);
        }, 700);
      }
    }, 38);

    return () => {
      window.clearInterval(typeId);
      cancelAnimationFrame(fadeRaf);
    };
  }, []);

  useEffect(() => {
    if (!world) return undefined;

    let raf = 0;
    const tick = () => {
      if (lineRef.current) {
        const chapter = worldText("chapter");
        lineRef.current.textContent = `${chapter} · ${world.quality.tier} · ${(world.state.progress * 100).toFixed(1)}% · v ${world.state.velocity.toFixed(2)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [world]);

  return (
    <div className="scroll-world__hud">
      <div className="scroll-world__hud-title">VORQEN</div>
      {!connectDone && (
        <div ref={connectRef} className="scroll-world__hud-connect" aria-live="polite" />
      )}
      <div ref={lineRef} className="scroll-world__hud-line">
        {world ? `${worldText("chapter")} · scroll` : "…"}
      </div>
      <p className="scroll-world__hud-hint">{worldText("scrollHint")}</p>
      <a className="scroll-world__back" href="/">
        ← Back to portfolio
      </a>
    </div>
  );
}