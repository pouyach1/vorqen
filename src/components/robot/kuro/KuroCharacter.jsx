import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { MOODS } from "./moods";
import { CERAMIC, CERAMIC_SHADOW } from "./tokens";
import EyeShape from "./EyeShape";

/**
 * Kuro character body — follows pointer within `containerRef` and responds to tap.
 */
export default function KuroCharacter({ mood, onTap, containerRef }) {
  const [blink, setBlink] = useState(false);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 90, damping: 16, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 90, damping: 16, mass: 0.6 });
  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return undefined;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mx.set(Math.max(-1, Math.min(1, nx)));
      my.set(Math.max(-1, Math.min(1, ny)));
      setLook({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
    };
    const handleLeave = () => {
      mx.set(0);
      my.set(0);
      setLook({ x: 0, y: 0 });
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, mx, my]);

  useEffect(() => {
    if (reduce) return undefined;
    let cancelled = false;
    let handle;
    const cycle = () => {
      const delay = 2600 + Math.random() * 3200;
      handle = setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        setTimeout(() => !cancelled && setBlink(false), 140);
        cycle();
      }, delay);
    };
    cycle();
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [reduce]);

  const cfg = MOODS[mood];

  return (
    <motion.div
      onClick={onTap}
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={
        onTap
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTap();
              }
            }
          : undefined
      }
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        cursor: onTap ? "pointer" : "default",
      }}
      animate={reduce ? undefined : { y: [0, -14, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative select-none"
      aria-label="Kuro companion"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -18,
          width: 220,
          height: 40,
          background: `radial-gradient(ellipse, ${cfg.glow}, transparent 70%)`,
          filter: "blur(6px)",
          transition: "background 0.6s ease",
        }}
      />

      {["left", "right"].map((side) => (
        <div
          key={side}
          className="absolute rounded-full"
          style={{
            top: -46,
            [side]: 46,
            width: 8,
            height: 46,
            background: `linear-gradient(180deg, ${CERAMIC}, ${CERAMIC_SHADOW})`,
            transform: `rotate(${side === "left" ? -18 : 18}deg)`,
            transformOrigin: "bottom center",
            boxShadow: "inset -2px 0 3px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 12,
              height: 12,
              background: cfg.accent,
              boxShadow: `0 0 12px 3px ${cfg.glow}`,
              transition: "background 0.6s ease, box-shadow 0.6s ease",
            }}
          />
        </div>
      ))}

      {["left", "right"].map((side) => (
        <div
          key={`ear-${side}`}
          className="absolute rounded-full"
          style={{
            top: 46,
            [side]: -14,
            width: 26,
            height: 46,
            background: `linear-gradient(${side === "left" ? "100deg" : "260deg"}, ${CERAMIC}, ${CERAMIC_SHADOW})`,
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
          }}
        />
      ))}

      <div
        className="relative rounded-[46px]"
        style={{
          width: 220,
          height: 168,
          background: `linear-gradient(155deg, #ffffff 0%, ${CERAMIC} 45%, ${CERAMIC_SHADOW} 100%)`,
          boxShadow:
            "0 30px 60px -20px rgba(0,0,0,0.55), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -14px 22px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: 14,
            width: 22,
            height: 8,
            background: `linear-gradient(90deg, transparent, ${cfg.accent}55, transparent)`,
            boxShadow: `0 0 6px ${cfg.glow}`,
            transition: "all 0.6s ease",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center overflow-visible rounded-[34px]"
          style={{
            top: 30,
            width: 178,
            height: 110,
            background: "radial-gradient(120% 130% at 30% 15%, #24263a 0%, #0a0b14 55%, #050509 100%)",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 2px rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[34px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 35%)",
            }}
          />

          <motion.div
            className="flex items-center gap-4"
            animate={{ scaleY: blink ? 0.08 : 1 }}
            transition={{ duration: 0.09 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mood}-l`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.28 }}
              >
                <EyeShape mood={mood} side="left" look={look} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mood}-r`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.28 }}
              >
                <EyeShape mood={mood} side="right" look={look} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {cfg.glasses && (
            <div
              className="absolute rounded-full"
              style={{
                top: 43,
                left: "50%",
                transform: "translateX(-50%)",
                width: 26,
                height: 3,
                background: cfg.accent,
                opacity: 0.8,
                boxShadow: `0 0 6px ${cfg.glow}`,
              }}
            />
          )}

          {(mood === "happy" || mood === "love" || mood === "playful") && (
            <>
              <div
                className="absolute rounded-full"
                style={{
                  bottom: 16,
                  left: 26,
                  width: 10,
                  height: 4,
                  background: cfg.accessoryColor,
                  opacity: 0.55,
                  filter: "blur(1px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  bottom: 16,
                  right: 26,
                  width: 10,
                  height: 4,
                  background: cfg.accessoryColor,
                  opacity: 0.55,
                  filter: "blur(1px)",
                }}
              />
            </>
          )}
        </div>
      </div>

      <div
        className="relative mx-auto rounded-[38px]"
        style={{
          marginTop: -8,
          width: 168,
          height: 96,
          background: `linear-gradient(155deg, #ffffff 0%, ${CERAMIC} 50%, ${CERAMIC_SHADOW} 100%)`,
          boxShadow: "0 22px 40px -16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.85)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: 16,
            width: 16,
            height: 16,
            background: `radial-gradient(circle at 35% 30%, ${cfg.accent}, transparent 70%)`,
            border: `2px solid ${cfg.accent}66`,
            boxShadow: `0 0 14px ${cfg.glow}`,
            transition: "all 0.6s ease",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: 30,
            left: -14,
            width: 26,
            height: 26,
            background: `linear-gradient(140deg, #fff, ${CERAMIC_SHADOW})`,
            boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: 30,
            right: -14,
            width: 26,
            height: 26,
            background: `linear-gradient(220deg, #fff, ${CERAMIC_SHADOW})`,
            boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}
