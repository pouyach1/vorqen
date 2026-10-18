import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AboutChapterRail from "./AboutChapterRail";
import CodeEditor, { usePrefersReducedMotion } from "./CodeEditor";
import AIResponsePanel from "./AIResponsePanel";
import SystemStatusBar from "./SystemStatusBar";
import AboutRobotGuide from "./AboutRobotGuide";
import {
  ABOUT_CHAPTERS,
  ABOUT_CREATOR,
  BOOT_LINES,
  CHAPTERS,
} from "../../../data/aboutWorkstation";

const PHASE = {
  BOOT: "boot",
  TYPING: "typing",
  PROCESSING: "processing",
  RESPONSE: "response",
  READY: "ready",
};

export default function AboutWorkstation() {
  const reducedMotion = usePrefersReducedMotion();
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [activeId, setActiveId] = useState(CHAPTERS[0].id);
  const [phase, setPhase] = useState(PHASE.BOOT);
  const [typedLength, setTypedLength] = useState(0);
  const timers = useRef([]);
  const autoAdvance = useRef(true);

  const chapter = ABOUT_CHAPTERS[activeId];
  const chapterMeta = CHAPTERS.find((c) => c.id === activeId);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Boot sequence once
  useEffect(() => {
    if (reducedMotion) {
      setBooted(true);
      setPhase(PHASE.READY);
      setTypedLength(ABOUT_CHAPTERS[CHAPTERS[0].id].code.length);
      return undefined;
    }
    let i = 0;
    const tick = () => {
      if (i >= BOOT_LINES.length) {
        setBooted(true);
        return;
      }
      setBootLine(i);
      i += 1;
      schedule(tick, i === BOOT_LINES.length ? 500 : 420);
    };
    tick();
    return clearTimers;
  }, [reducedMotion, schedule, clearTimers]);

  const runChapter = useCallback(
    (id, { fromUser = false } = {}) => {
      clearTimers();
      if (fromUser) autoAdvance.current = false;

      const data = ABOUT_CHAPTERS[id];
      setActiveId(id);
      setTypedLength(0);

      if (reducedMotion) {
        setPhase(PHASE.READY);
        setTypedLength(data.code.length);
        return;
      }

      setPhase(PHASE.TYPING);
      const total = data.code.length;
      const step = Math.max(1, Math.floor(total / 48));
      let pos = 0;

      const typeTick = () => {
        pos = Math.min(total, pos + step);
        setTypedLength(pos);
        if (pos < total) {
          schedule(typeTick, 28);
        } else {
          setPhase(PHASE.PROCESSING);
          schedule(() => {
            setPhase(PHASE.RESPONSE);
            schedule(() => {
              setPhase(PHASE.READY);
              if (autoAdvance.current) {
                const idx = CHAPTERS.findIndex((c) => c.id === id);
                if (idx >= 0 && idx < CHAPTERS.length - 1) {
                  schedule(() => runChapter(CHAPTERS[idx + 1].id), 2200);
                }
              }
            }, 400);
          }, 550);
        }
      };
      schedule(typeTick, 200);
    },
    [clearTimers, reducedMotion, schedule]
  );

  // Start first chapter once after boot (do not re-run when runChapter identity changes)
  useEffect(() => {
    if (!booted) return undefined;
    runChapter(CHAPTERS[0].id);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot gate only
  }, [booted]);

  const onSelectChapter = (id) => {
    runChapter(id, { fromUser: true });
  };

  return (
    <section className="section-container pt-32 pb-16 md:pt-40" aria-labelledby="about-workstation-title">
      <div className="mb-8 max-w-2xl">
        <p className="font-heading text-sm uppercase tracking-[0.3em] text-purple-neon">
          Developer Environment
        </p>
        <h1 id="about-workstation-title" className="mt-3 text-3xl font-black text-white md:text-5xl">
          Inside the{" "}
          <span className="bg-gradient-to-r from-cyan-neon via-purple-neon to-magenta-neon bg-clip-text text-transparent">
            creator workspace
          </span>
        </h1>
        <p className="mt-4 text-slate-400">
          {ABOUT_CREATOR.robotName} guides you through a live profile session — code on the left,
          system interpretation on the right. Select a chapter anytime.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] items-center justify-center rounded-2xl border border-cyan-neon/20 bg-panel/80 p-10 backdrop-blur-md"
          >
            <div className="w-full max-w-md font-mono text-sm text-cyan-neon">
              {BOOT_LINES.slice(0, bootLine + 1).map((line) => (
                <p key={line} className="py-1">
                  <span className="text-slate-600">&gt;</span> {line}
                </p>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ide"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-cyan-neon/20 bg-panel/70 p-3 shadow-neon-cyan backdrop-blur-md md:p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-neon/10 pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  session · {ABOUT_CREATOR.name}
                </p>
                <p className="font-heading text-sm uppercase tracking-widest text-white">
                  {ABOUT_CREATOR.role}
                </p>
              </div>
              <p className="font-mono text-[10px] text-emerald-neon">profile.mount = true</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-stretch">
              <div className="order-1 lg:order-none">
                <AboutChapterRail
                  chapters={CHAPTERS}
                  activeId={activeId}
                  onSelect={onSelectChapter}
                  reducedMotion={reducedMotion}
                />
              </div>

              <div className="order-2 min-h-0 lg:order-none">
                <CodeEditor
                  chapter={chapter}
                  isTyping={phase === PHASE.TYPING}
                  typedLength={typedLength}
                />
              </div>

              <div className="order-3 flex min-h-0 flex-col gap-4 lg:order-none">
                <AIResponsePanel chapter={chapter} phase={phase} reducedMotion={reducedMotion} />
                <div className="hidden justify-center lg:flex">
                  <AboutRobotGuide />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center lg:hidden">
              <AboutRobotGuide />
            </div>

            <div className="mt-4">
              <SystemStatusBar chapterLabel={chapterMeta?.label ?? ""} phase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
