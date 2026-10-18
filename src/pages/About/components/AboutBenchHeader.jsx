import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import KuroCharacter from "../../../components/robot/kuro/KuroCharacter";

const SCALE = 0.26;
const BASE_W = 260;
const BASE_H = 340;

const BEATS = {
  idle: 2000,
  discover: 3400,
  approach: 3200,
  startle: 3400,
  retreat: 3000,
  hello: 3600,
  rest: 2600,
};

const ACT_ORDER = ["discover", "approach", "startle", "retreat", "hello"];

function GoldfishBowl({ fishBump, reduce }) {
  return (
    <motion.div
      className="relative mb-3 h-[56px] w-[48px] shrink-0"
      aria-hidden
      animate={
        reduce
          ? undefined
          : fishBump
            ? { rotate: [0, -10, 8, -4, 0], x: [0, -2, 2, 0] }
            : { rotate: 0, x: 0 }
      }
      transition={{ duration: 0.45 }}
    >
      {/* Wooden stand */}
      <div
        className="absolute inset-x-[6px] bottom-0 h-[6px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #8b6239 0%, #5c3d22 55%, #3a2514 100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,210,160,0.25)",
        }}
      />
      <div
        className="absolute inset-x-[10px] bottom-[5px] h-[4px] rounded-sm"
        style={{
          background: "linear-gradient(90deg, #6a4528, #9a6d42, #6a4528)",
          boxShadow: "inset 0 1px 0 rgba(255,220,180,0.2)",
        }}
      />

      {/* Glass bowl */}
      <div
        className="absolute inset-x-0 bottom-[8px] h-[44px] overflow-hidden rounded-[50%_50%_46%_46%/58%_58%_42%_42%] border border-cyan-neon/55"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 34% 28%, rgba(230,250,255,0.55) 0%, rgba(90,180,240,0.22) 38%, rgba(20,55,95,0.55) 72%, rgba(8,22,40,0.75) 100%)",
          boxShadow:
            "inset 0 -10px 14px rgba(0,60,120,0.4), inset 3px 4px 8px rgba(255,255,255,0.18), 0 0 16px rgba(0,243,255,0.22)",
        }}
      >
        {/* Water surface line */}
        <div
          className="absolute inset-x-[4px] top-[10px] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(180,230,255,0.55), transparent)",
          }}
        />
        {/* Glass shine */}
        <div
          className="absolute start-[5px] top-[6px] h-[22px] w-[7px] rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))",
            filter: "blur(0.3px)",
          }}
        />
        {/* Gravel */}
        <div
          className="absolute inset-x-[5px] bottom-[3px] h-[7px] rounded-[40%]"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, #6b5344 0 2px, transparent 3px), radial-gradient(circle at 45% 40%, #8a6a4a 0 1.5px, transparent 2.5px), radial-gradient(circle at 70% 55%, #5a4334 0 2px, transparent 3px), linear-gradient(180deg, #4a3828, #2e2218)",
          }}
        />

        {/* Bubbles */}
        {!reduce && (
          <>
            <motion.span
              className="absolute start-[14px] top-[20px] h-[3px] w-[3px] rounded-full bg-white/40"
              animate={{ y: [0, -10, 0], opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute start-[26px] top-[24px] h-[2px] w-[2px] rounded-full bg-white/30"
              animate={{ y: [0, -12, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </>
        )}

        {/* Goldfish — body + eye + tail */}
        <motion.div
          className="absolute start-[11px] top-[16px] h-[14px] w-[22px]"
          animate={
            reduce
              ? undefined
              : fishBump
                ? { x: [0, 5, -4, 0], y: [0, -2, 1, 0], rotate: [0, 8, -6, 0] }
                : { x: [0, 4, 0, -3, 0], y: [0, -1.5, 0, 1, 0] }
          }
          transition={
            fishBump
              ? { duration: 0.4 }
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Tail */}
          <span
            className="absolute -start-[5px] top-[2px] h-[10px] w-[8px]"
            style={{
              background: "linear-gradient(90deg, #ff5a00, #ff8a2a)",
              clipPath: "polygon(100% 50%, 0 0, 15% 50%, 0 100%)",
              filter: "drop-shadow(0 0 2px rgba(255,100,0,0.5))",
            }}
          />
          {/* Body */}
          <span
            className="absolute start-[2px] top-[1px] h-[12px] w-[16px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 35% 35%, #ffb060 0%, #ff7a28 45%, #e84800 100%)",
              boxShadow: "0 0 8px rgba(255,90,0,0.55)",
            }}
          />
          {/* Fin */}
          <span
            className="absolute start-[7px] -top-[2px] h-[5px] w-[7px]"
            style={{
              background: "linear-gradient(180deg, #ff9a40, transparent)",
              clipPath: "polygon(30% 100%, 50% 0, 70% 100%)",
              opacity: 0.85,
            }}
          />
          {/* Eye */}
          <span className="absolute end-[4px] top-[4px] h-[3px] w-[3px] rounded-full bg-[#1a1008]">
            <span className="absolute start-[0.5px] top-[0.5px] h-[1px] w-[1px] rounded-full bg-white/80" />
          </span>
        </motion.div>
      </div>

      {/* Bowl rim */}
      <div
        className="absolute inset-x-[1px] top-0 h-[5px] rounded-full border border-cyan-neon/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(220,245,255,0.35), rgba(80,140,180,0.15))",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        }}
      />
    </motion.div>
  );
}

function WoodenBench() {
  return (
    <div className="relative z-[5] mx-auto w-[88px]" aria-hidden>
      {/* Backrest */}
      <div
        className="relative mx-auto h-[22px] w-[78px] rounded-t-[5px]"
        style={{
          background:
            "linear-gradient(180deg, #b88958 0%, #8f6540 40%, #6a482c 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,220,180,0.35), inset 0 -2px 4px rgba(0,0,0,0.2)",
        }}
      >
        {/* Slats */}
        <div className="absolute inset-x-[6px] top-[5px] h-px bg-[#5c3d22]/50" />
        <div className="absolute inset-x-[6px] top-[11px] h-px bg-[#5c3d22]/40" />
        <div className="absolute inset-x-[6px] top-[17px] h-px bg-[#5c3d22]/35" />
      </div>

      {/* Seat */}
      <div
        className="relative z-[1] -mt-px mx-auto h-[10px] w-[86px] rounded-[4px]"
        style={{
          background:
            "linear-gradient(180deg, #d4a878 0%, #b88756 32%, #8a5f38 70%, #5a3a20 100%)",
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,230,200,0.45), inset 0 -1px 0 rgba(0,0,0,0.25)",
        }}
      >
        <div className="absolute inset-x-[8px] top-[3px] h-px bg-[#6a4528]/35" />
        <div className="absolute inset-x-[8px] top-[6px] h-px bg-[#6a4528]/25" />
      </div>

      {/* Legs */}
      <div className="relative mx-auto flex w-[72px] justify-between px-0.5">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="block h-[10px] w-[4px] rounded-b-[2px]"
            style={{
              background: "linear-gradient(180deg, #7a5230 0%, #4a3018 60%, #2a1a0e 100%)",
              boxShadow: "1px 0 0 rgba(255,200,150,0.12), 0 2px 3px rgba(0,0,0,0.4)",
            }}
          />
        ))}
      </div>

      {/* Soft contact shadow */}
      <div
        className="absolute -bottom-1 start-1/2 h-[6px] w-[70px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%)",
        }}
      />
    </div>
  );
}

/**
 * Kuro + bench + fishbowl beside the About header.
 */
export default function AboutBenchHeader() {
  const { t, i18n } = useTranslation("about");
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState("idle");
  const [mood, setMood] = useState("focused");
  const [actId, setActId] = useState(null);
  const [fishBump, setFishBump] = useState(false);

  const isFa = i18n.language === "fa";
  const isRtl = i18n.dir() === "rtl";
  const towardBowlX = isRtl ? 36 : -36;

  const act = useMemo(() => {
    if (!actId) return null;
    return {
      id: actId,
      index: t(`bench.acts.${actId}.index`),
      title: t(`bench.acts.${actId}.title`),
      line: t(`bench.acts.${actId}.line`),
    };
  }, [actId, t, i18n.language]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible) {
      setPhase("idle");
      setMood("focused");
      setActId(null);
      setFishBump(false);
      return undefined;
    }

    let cancelled = false;
    let timer;
    const wait = (ms) =>
      new Promise((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    const run = async () => {
      while (!cancelled) {
        setPhase("idle");
        setMood("focused");
        setActId(null);
        setFishBump(false);
        await wait(BEATS.idle);
        if (cancelled) break;

        setPhase("discover");
        setMood("thinking");
        setActId("discover");
        await wait(BEATS.discover);
        if (cancelled) break;

        setPhase("approach");
        setMood("excited");
        setActId("approach");
        await wait(BEATS.approach);
        if (cancelled) break;

        setPhase("startle");
        setMood("excited");
        setActId("startle");
        setFishBump(true);
        await wait(Math.min(700, BEATS.startle));
        if (cancelled) break;
        setFishBump(false);
        setPhase("flee");
        setMood("sad");
        await wait(BEATS.startle - 700);
        if (cancelled) break;

        setPhase("retreat");
        setMood("sleepy");
        setActId("retreat");
        await wait(BEATS.retreat);
        if (cancelled) break;

        setPhase("hello");
        setMood("happy");
        setActId("hello");
        await wait(BEATS.hello);
        if (cancelled) break;

        setPhase("idle");
        setMood("focused");
        setActId(null);
        await wait(BEATS.rest);
      }
    };

    run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce, visible, i18n.language]);

  const kuroMotion = (() => {
    if (reduce) return { x: 0, y: 0, rotate: 0, scale: 1 };
    switch (phase) {
      case "discover":
        return { x: towardBowlX * 0.35, y: 2, rotate: isRtl ? 8 : -8, scale: 1 };
      case "approach":
        return { x: towardBowlX, y: 4, rotate: isRtl ? 6 : -6, scale: 0.96 };
      case "startle":
        return { x: towardBowlX * 0.85, y: -10, rotate: 0, scale: 1.08 };
      case "flee":
        return { x: isRtl ? -8 : 8, y: 0, rotate: isRtl ? -12 : 12, scale: 1 };
      case "retreat":
        return { x: 0, y: 3, rotate: isRtl ? -4 : 4, scale: 0.98 };
      case "hello":
        return { x: 0, y: -4, rotate: 0, scale: 1.04 };
      default:
        return { x: 0, y: 0, rotate: 0, scale: 1 };
    }
  })();

  const stageW = BASE_W * SCALE;
  const stageH = BASE_H * SCALE;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto absolute end-1 top-[calc(100%-2px)] z-20 hidden origin-top select-none sm:block md:end-2"
      role="img"
      aria-label={t("bench.aria")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 bottom-0 top-10 rounded-[32px] bg-[radial-gradient(ellipse_at_70%_10%,rgba(0,243,255,0.14),transparent_70%)]"
      />

      <div className="relative flex w-[min(340px,58vw)] flex-col items-stretch gap-2.5">
        {/* Dialogue */}
        <div className="relative min-h-[88px]">
          <AnimatePresence mode="wait">
            {act ? (
              <motion.div
                key={`${i18n.language}-${act.id}`}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="pointer-events-none relative z-30"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border border-cyan-neon/50 bg-gradient-to-br from-[#071820]/98 via-[#041018]/97 to-[#0a0614]/98 px-3.5 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(0,243,255,0.2)] backdrop-blur-md ${
                    isFa ? "text-end" : "text-start"
                  }`}
                  dir={isFa ? "rtl" : "ltr"}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-2.5 start-0 w-[3px] rounded-full bg-gradient-to-b from-cyan-neon via-purple-neon to-magenta-neon"
                  />
                  <p
                    className={`mb-1.5 ps-2.5 text-[12px] text-cyan-neon ${
                      isFa
                        ? "font-heading tracking-normal"
                        : "font-mono uppercase tracking-[0.14em]"
                    }`}
                  >
                    <span dir="ltr" className="text-emerald-neon">
                      {act.index}
                    </span>
                    <span className="mx-1.5 text-slate-600">/</span>
                    <span className="text-slate-200">{act.title}</span>
                  </p>
                  <p
                    className={`ps-2.5 font-heading font-semibold text-white ${
                      isFa
                        ? "text-[15px] leading-[1.85]"
                        : "text-[14px] leading-relaxed"
                    }`}
                  >
                    {act.line}
                  </p>
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 end-12 h-3 w-3 rotate-45 border-b border-e border-cyan-neon/45 bg-[#041018]"
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Stage */}
        <div className="relative flex items-end justify-end gap-3 pe-1">
          <GoldfishBowl fishBump={fishBump} reduce={reduce} />

          <div className="relative w-[96px]">
            <motion.div
              className="relative z-10 mx-auto"
              animate={kuroMotion}
              transition={
                phase === "flee"
                  ? { type: "spring", stiffness: 320, damping: 18 }
                  : phase === "startle"
                    ? { type: "spring", stiffness: 400, damping: 14 }
                    : { type: "spring", stiffness: 160, damping: 18 }
              }
              style={{
                width: stageW,
                height: stageH,
                marginBottom: -4,
              }}
            >
              <div
                ref={stageRef}
                className="absolute bottom-0 left-1/2 flex items-center justify-center"
                style={{
                  width: BASE_W,
                  height: BASE_H,
                  transform: `translateX(-50%) scale(${SCALE})`,
                  transformOrigin: "center bottom",
                }}
              >
                <KuroCharacter mood={mood} containerRef={stageRef} />
              </div>
            </motion.div>

            <WoodenBench />
          </div>
        </div>
      </div>

      <span className="sr-only">
        {ACT_ORDER.map((id) => t(`bench.acts.${id}.title`)).join(" · ")}
      </span>
    </div>
  );
}
