import { Suspense, useEffect, useState, useCallback, useRef, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import MiniKuroController from "../kuro3d/MiniKuroController";
import AboutKuroPerchFallback from "./AboutKuroPerchFallback";

class Kuro3DBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <AboutKuroPerchFallback />;
    return this.props.children;
  }
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

/**
 * Living 3D Kuro seated on the About header perch shelf.
 * Body stays above the ledge; only tiny legs dangle below.
 */
export default function AboutKuroPerch() {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [use3d, setUse3d] = useState(true);
  const [lookBias, setLookBias] = useState(0);
  const [ackToken, setAckToken] = useState(0);
  const lookTimer = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 639px)").matches;
    if (coarse || narrow || reduce || !canUseWebGL()) setUse3d(false);
  }, [reduce]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [use3d]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!use3d || reduce) return undefined;
    const corridor = document.getElementById("about-corridor");
    if (!corridor || typeof IntersectionObserver === "undefined") return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        lastScrollY.current = y;
        setLookBias(delta >= 0 ? 1 : -1);
        window.clearTimeout(lookTimer.current);
        lookTimer.current = window.setTimeout(() => setLookBias(0), 1200);
      },
      { threshold: 0.22, rootMargin: "-8% 0px -35% 0px" }
    );
    io.observe(corridor);
    return () => {
      io.disconnect();
      window.clearTimeout(lookTimer.current);
    };
  }, [use3d, reduce]);

  const onAck = useCallback(() => {
    if (reduce || !use3d) return;
    setAckToken((n) => n + 1);
  }, [reduce, use3d]);

  if (!use3d || reduce) {
    return <AboutKuroPerchFallback />;
  }

  const living = visible && !tabHidden;

  return (
    <Kuro3DBoundary>
      <div
        ref={wrapRef}
        className="pointer-events-auto absolute bottom-[-16px] end-1 z-20 hidden h-[118px] w-[92px] origin-bottom sm:block md:end-3 md:w-[100px]"
        onPointerEnter={onAck}
        onFocus={onAck}
        tabIndex={0}
        role="img"
        aria-label="Kuro"
      >
        <Canvas
          orthographic
          camera={{ position: [0.12, 0.28, 3.5], zoom: 78, near: 0.1, far: 20 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "low-power",
          }}
          frameloop={living ? "always" : "demand"}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            touchAction: "none",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[2.4, 3.2, 2.2]} intensity={0.92} color="#e8f9ff" />
          <directionalLight position={[-2.2, 1.2, -1]} intensity={0.4} color="#b48cff" />
          <Suspense fallback={null}>
            <MiniKuroController
              enabled={living}
              lookBias={lookBias}
              ackToken={ackToken}
              reduceMotion={false}
            />
          </Suspense>
        </Canvas>
      </div>
    </Kuro3DBoundary>
  );
}
