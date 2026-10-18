import { useEffect, useRef, useState } from "react";
import { World } from "./core/world";
import { createScrollController } from "./scroll/scrollController";
import { createDebugMarkerScene } from "./scenes/debugMarker";
import ScrollWorldHud from "./ScrollWorldHud";
import "./styles/world.css";

/**
 * React bridge for Stages 1–3 scroll world (WebGL + Lenis + ScrollTrigger).
 * Mount only on /world so site-wide SmoothScroll does not conflict.
 */
export default function ScrollWorldExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const proxy = proxyRef.current;
    if (!canvas || !proxy) return undefined;

    document.documentElement.classList.add("lenis");

    const nextWorld = new World(canvas);
    nextWorld.scenes.register(createDebugMarkerScene());
    const scroll = createScrollController(nextWorld, proxy);
    nextWorld.start();
    setWorld(nextWorld);

    console.info("[experience] Stages 1–3 online (scaffold + core + scroll)");

    return () => {
      scroll.destroy();
      nextWorld.dispose();
      setWorld(null);
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return (
    <div className="scroll-world">
      <canvas
        ref={canvasRef}
        className="scroll-world__canvas"
        aria-hidden="true"
      />
      <div ref={proxyRef} className="scroll-world__proxy" aria-hidden="true" />
      <div className="scroll-world__ui">
        <ScrollWorldHud world={world} />
      </div>
      <div className="sr-only">
        Immersive scroll-driven 3D portfolio world. Scroll to fly the camera along
        the path. Use the back link to return to the main site.
      </div>
    </div>
  );
}
