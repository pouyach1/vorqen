import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CERAMIC, CERAMIC_SHADOW } from "../../../components/robot/kuro/tokens";

/** Lightweight 2D perch — mobile / reduced-motion / WebGL fallback. */
export default function AboutKuroPerchFallback() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [active, setActive] = useState(true);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !active) return undefined;
    let cancelled = false;
    let handle;
    const cycle = () => {
      handle = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        window.setTimeout(() => !cancelled && setBlink(false), 120);
        cycle();
      }, 2800 + Math.random() * 2400);
    };
    cycle();
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [reduce, active]);

  const swing = !reduce && active;

  return (
    <motion.div
      ref={ref}
      className="pointer-events-auto absolute bottom-[-14px] end-2 z-20 origin-bottom select-none sm:end-4"
      initial={reduce ? false : { y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay: 0.3 }}
      tabIndex={0}
      role="img"
      aria-label="Kuro"
    >
      <div className="relative" style={{ width: 52 }}>
        {/* Soft contact cue */}
        <div
          className="absolute start-1/2 top-[40px] h-1.5 w-9 -translate-x-1/2 rounded-full bg-cyan-neon/25 blur-[2px]"
          aria-hidden
        />

        {/* Oversized head */}
        <div
          className="relative mx-auto"
          style={{
            width: 40,
            height: 34,
            borderRadius: 16,
            background: `linear-gradient(155deg, #fff 0%, ${CERAMIC} 50%, ${CERAMIC_SHADOW} 100%)`,
            boxShadow: "0 6px 14px -8px rgba(0,0,0,0.5)",
          }}
        >
          {/* Antenna tips */}
          <span
            className="absolute -top-1.5 start-[8px] h-1.5 w-1.5 rounded-full bg-cyan-neon"
            style={{ boxShadow: "0 0 6px rgba(0,243,255,0.7)" }}
          />
          <span
            className="absolute -top-1.5 end-[8px] h-1.5 w-1.5 rounded-full bg-cyan-neon"
            style={{ boxShadow: "0 0 6px rgba(0,243,255,0.7)" }}
          />
          {/* Face screen + heart eyes */}
          <div
            className="absolute left-1/2 top-[7px] flex -translate-x-1/2 items-center justify-center gap-[5px] rounded-[7px]"
            style={{ width: 28, height: 15, background: "#0a0b14" }}
          >
            {blink ? (
              <>
                <span className="block h-px w-2 rounded-full bg-[#ff6fa5]" />
                <span className="block h-px w-2 rounded-full bg-[#ff6fa5]" />
              </>
            ) : (
              <>
                <svg width="9" height="8" viewBox="0 0 60 44" aria-hidden>
                  <path
                    d="M30,34 C15,23 9,12 18,7 C24,4 30,9 30,13 C30,9 36,4 42,7 C51,12 45,23 30,34 Z"
                    fill="#ff6fa5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,111,165,0.8))" }}
                  />
                </svg>
                <svg width="9" height="8" viewBox="0 0 60 44" aria-hidden>
                  <path
                    d="M30,34 C15,23 9,12 18,7 C24,4 30,9 30,13 C30,9 36,4 42,7 C51,12 45,23 30,34 Z"
                    fill="#ff6fa5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,111,165,0.8))" }}
                  />
                </svg>
              </>
            )}
          </div>
        </div>

        {/* Tiny torso above perch */}
        <div
          className="relative mx-auto -mt-0.5"
          style={{
            width: 26,
            height: 14,
            borderRadius: 10,
            background: `linear-gradient(160deg, ${CERAMIC}, ${CERAMIC_SHADOW})`,
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-neon"
            style={{ boxShadow: "0 0 5px rgba(112,0,255,0.55)" }}
          />
        </div>

        {/* Legs dangling below the ledge */}
        <div className="absolute start-1/2 top-[46px] flex -translate-x-1/2 gap-2">
          <span
            className={`block w-[3px] origin-top rounded-full ${swing ? "kuro-perch-leg--swing-l" : ""}`}
            style={{ height: 12, background: `linear-gradient(180deg, ${CERAMIC}, ${CERAMIC_SHADOW})` }}
          />
          <span
            className={`block w-[3px] origin-top rounded-full ${swing ? "kuro-perch-leg--swing-r" : ""}`}
            style={{ height: 12, background: `linear-gradient(180deg, ${CERAMIC}, ${CERAMIC_SHADOW})` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
