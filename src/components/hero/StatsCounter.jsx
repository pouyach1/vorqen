import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { HERO_STATS } from "../../lib/constants";
import { EASE, DURATION } from "../../lib/motion";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return undefined;

    if (reduce) {
      node.textContent = `${value}${suffix}`;
      return undefined;
    }

    const duration = 1100;
    const start = performance.now();
    let raf;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Number((value * eased).toFixed(value % 1 !== 0 ? 1 : 0));
      node.textContent = `${current}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, suffix, reduce]);

  return (
    <span ref={ref} className="font-display text-3xl font-black text-white md:text-4xl">
      0{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const reduce = useReducedMotion();

  return (
    <div className="mt-12 grid grid-cols-3 gap-6 border-t border-cyan-neon/10 pt-8">
      {HERO_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 + i * 0.08, duration: DURATION.base, ease: EASE.out }}
        >
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-500 md:text-xs">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
