import { useEffect, useRef } from "react";
import type { World } from "./core/world";

interface ScrollWorldHudProps {
  world: World | null;
}

export default function ScrollWorldHud({ world }: ScrollWorldHudProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!world) return undefined;

    let raf = 0;
    const tick = () => {
      if (lineRef.current) {
        lineRef.current.textContent = `quality: ${world.quality.tier} · progress ${(world.state.progress * 100).toFixed(1)}% · v ${world.state.velocity.toFixed(2)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [world]);

  return (
    <div className="scroll-world__hud">
      <div className="scroll-world__hud-title">Scroll World</div>
      <div ref={lineRef} className="scroll-world__hud-line">
        {world ? `quality: ${world.quality.tier} · scroll to fly` : "booting…"}
      </div>
      <a className="scroll-world__back" href="/">
        ← Back to portfolio
      </a>
    </div>
  );
}
