import { motion, useReducedMotion } from "framer-motion";
import NeonButton from "../ui/NeonButton";
import StatsCounter from "./StatsCounter";
import HeroRobot3D from "./HeroRobot3D";
import { SITE } from "../../lib/constants";
import { EASE, DURATION } from "../../lib/motion";

const headline = ["CREATIVE", "DEVELOPER", "& BOT ARCHITECT"];

/**
 * Hero — calm entrance; Kuro carries brand motion in HeroRobot3D.
 */
export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="section-container relative grid min-h-[88svh] items-center gap-12 pb-8 pt-36 md:grid-cols-2 md:gap-14 md:pb-12 md:pt-40"
    >
      <div className="relative z-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE.out }}
          className="mb-5 inline-flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gradient-to-r from-purple-neon to-transparent" />
          <p className="font-heading text-sm uppercase tracking-[0.35em] text-purple-neon">
            {SITE.name}
          </p>
          <span className="rounded-full border border-cyan-neon/25 bg-cyan-neon/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-neon/80">
            Digital Studio
          </span>
        </motion.div>

        <h1 className="text-4xl font-black leading-[1.05] text-white md:text-6xl lg:text-[4.25rem]">
          {headline.map((line, i) => (
            <span key={line} className="hero-mask-line">
              <motion.span
                className={
                  i === 1
                    ? "inline-block bg-gradient-to-r from-cyan-neon via-purple-neon to-magenta-neon bg-clip-text text-transparent"
                    : "inline-block"
                }
                initial={reduce ? false : { y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: DURATION.slow,
                  delay: 0.12 + i * 0.08,
                  ease: EASE.out,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, delay: 0.4, ease: EASE.out }}
          className="mt-7 max-w-md text-[15px] leading-relaxed text-slate-400 md:text-base"
        >
          I design and ship futuristic Telegram bot ecosystems and immersive web
          experiences — from crypto auto-traders to award-level 3D interfaces.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, delay: 0.5, ease: EASE.out }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <NeonButton as="a" href="#projects" variant="cyan">
            Explore Showcase
          </NeonButton>
          <NeonButton as="a" href="#bots" variant="purple">
            Test Telegram Bots
          </NeonButton>
        </motion.div>

        <StatsCounter />
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, delay: 0.25, ease: EASE.out }}
        className="relative z-10"
      >
        <HeroRobot3D />
      </motion.div>
    </section>
  );
}
