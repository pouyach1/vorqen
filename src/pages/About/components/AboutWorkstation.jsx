import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AboutChapterRail from "./AboutChapterRail";
import CodeEditor, { usePrefersReducedMotion } from "./CodeEditor";
import AIResponsePanel from "./AIResponsePanel";
import SystemStatusBar from "./SystemStatusBar";
import AboutRobotGuide from "./AboutRobotGuide";
import UnwrittenLineFinale from "./UnwrittenLineFinale";
import {
  ABOUT_CHAPTERS,
  ABOUT_CREATOR,
  CHAPTERS,
  FINALE_PHASE,
  LIVING_CHAPTER_IDS,
  applyStoryBeat,
  getFinaleChoice,
  nextRevealDelay,
  resolveMappedBeat,
} from "../../../data/aboutWorkstation";

const PHASE = {
  BOOT: "boot",
  TYPING: "typing",
  PROCESSING: "processing",
  RESPONSE: "response",
  READY: "ready",
  LOCKED: "locked",
};

export default function AboutWorkstation() {
  const { t, i18n } = useTranslation("about");
  const reducedMotion = usePrefersReducedMotion();
  const isFa = i18n.language === "fa";
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [activeId, setActiveId] = useState("identity");
  const [phase, setPhase] = useState(PHASE.BOOT);
  const [typedLength, setTypedLength] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [storyBeat, setStoryBeat] = useState(0);
  /** Mood is independent from chapter id — later chapters can map their own moods. */
  const [kuroMood, setKuroMood] = useState("happy");
  const [finalePhase, setFinalePhase] = useState(FINALE_PHASE.OFF);
  const [finaleChoiceId, setFinaleChoiceId] = useState(null);
  const [epilogue, setEpilogue] = useState("");
  const [epilogueLength, setEpilogueLength] = useState(0);
  const [showContinued, setShowContinued] = useState(false);
  const [finaleReaction, setFinaleReaction] = useState("");
  const [finaleMood, setFinaleMood] = useState(null);
  const [finaleBeat, setFinaleBeat] = useState("idle");
  const timers = useRef([]);
  const typedRef = useRef(0);
  const skipRef = useRef(false);
  const runToken = useRef(0);
  const epilogueStarted = useRef(false);

  const bootLines = useMemo(() => {
    const lines = t("workstation.bootLines", { returnObjects: true });
    return Array.isArray(lines) ? lines : [];
  }, [t, i18n.language]);

  const chapters = useMemo(
    () =>
      CHAPTERS.map((ch) => ({
        ...ch,
        label: t(`chapters.${ch.id}.label`),
      })),
    [t, i18n.language]
  );

  const chapter = useMemo(() => {
    const data = ABOUT_CHAPTERS[activeId];
    const living = LIVING_CHAPTER_IDS.has(activeId);
    const response = living
      ? t(`chapters.${activeId}.response`, { returnObjects: true })
      : t("workstation.comingSoon.lines", { returnObjects: true });
    return {
      ...data,
      living,
      title: t(`chapters.${activeId}.label`),
      responseTitle: living
        ? t(`chapters.${activeId}.responseTitle`)
        : t("workstation.comingSoon.title", { robot: ABOUT_CREATOR.robotName }),
      response: Array.isArray(response) ? response : [],
    };
  }, [activeId, t, i18n.language]);

  const chapterMeta = chapters.find((c) => c.id === activeId);
  const typeProgress =
    chapter.code?.length > 0 ? Math.min(1, typedLength / chapter.code.length) : 0;

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setBooted(true);
      return undefined;
    }
    let i = 0;
    const tick = () => {
      if (i >= bootLines.length) {
        setBooted(true);
        return;
      }
      setBootLine(i);
      i += 1;
      schedule(tick, i === bootLines.length ? 480 : 400);
    };
    tick();
    return clearTimers;
  }, [reducedMotion, schedule, clearTimers, bootLines.length]);

  const startDialogueReveal = useCallback(
    (response, token, onDone) => {
      let r = 0;
      const revealTick = () => {
        if (token !== runToken.current) return;
        r += 1;
        setRevealedCount(r);
        if (r < response.length) {
          schedule(revealTick, nextRevealDelay(response, r));
        } else if (onDone) {
          schedule(onDone, 400);
        }
      };
      schedule(revealTick, 240);
    },
    [schedule]
  );

  const applyBeat = useCallback((data, beatIndex) => {
    const applied = applyStoryBeat(data, beatIndex);
    if (!applied) return null;
    typedRef.current = applied.typedLength;
    setTypedLength(applied.typedLength);
    setRevealedCount(applied.revealedCount);
    setStoryBeat(beatIndex);
    return applied;
  }, []);

  const resetFinale = useCallback(() => {
    epilogueStarted.current = false;
    setFinalePhase(FINALE_PHASE.OFF);
    setFinaleChoiceId(null);
    setEpilogue("");
    setEpilogueLength(0);
    setShowContinued(false);
    setFinaleReaction("");
    setFinaleMood(null);
    setFinaleBeat("idle");
  }, []);

  const beginFinale = useCallback(() => {
    epilogueStarted.current = false;
    setFinaleChoiceId(null);
    setEpilogue("");
    setEpilogueLength(0);
    setShowContinued(false);
    setFinaleReaction("");
    setFinaleMood("excited");
    setFinaleBeat("idle");
    setFinalePhase(FINALE_PHASE.IDLE);
  }, []);

  const finishTypingAndSpeak = useCallback(
    (id, token) => {
      if (token !== runToken.current) return;
      clearTimers();
      const data = ABOUT_CHAPTERS[id];
      const lines = t(`chapters.${id}.response`, { returnObjects: true });
      const response = Array.isArray(lines) ? lines : [];

      typedRef.current = data.code.length;
      setTypedLength(data.code.length);
      setKuroMood(data.kuroMood || "happy");
      setPhase(PHASE.PROCESSING);

      if (data.dialogueAdvance === "continue" && data.storyBeats?.length) {
        schedule(() => {
          if (token !== runToken.current) return;
          const last = data.storyBeats.length - 1;
          applyBeat(data, last);
          setKuroMood(
            resolveMappedBeat(data.moodBeats, data.storyBeats[last].dialogueUntil, data.kuroMood)
          );
          setPhase(PHASE.READY);
          if (data.hasFinale) beginFinale();
        }, 320);
        return;
      }

      schedule(() => {
        if (token !== runToken.current) return;
        setPhase(PHASE.RESPONSE);
        startDialogueReveal(response, token, () => {
          if (token !== runToken.current) return;
          setPhase(PHASE.READY);
        });
      }, 500);
    },
    [applyBeat, beginFinale, clearTimers, schedule, startDialogueReveal, t]
  );

  const openContinueDialogue = useCallback(
    (data, token) => {
      if (token !== runToken.current) return;
      setKuroMood(data.kuroMood || "thinking");
      setPhase(PHASE.PROCESSING);
      schedule(() => {
        if (token !== runToken.current) return;
        applyBeat(data, 0);
        setPhase(PHASE.RESPONSE);
      }, 360);
    },
    [applyBeat, schedule]
  );

  const runStagedChapter = useCallback(
    (id, data, token, response) => {
      const stages = data.codeStages;
      // Open with principles (+ class cue) so Kuro can start without char-by-char slog
      const introStages = Math.min(2, stages.length);
      let stage = 0;

      const revealStage = () => {
        if (token !== runToken.current) return;
        if (skipRef.current) {
          finishTypingAndSpeak(id, token);
          return;
        }

        typedRef.current = stages[stage];
        setTypedLength(stages[stage]);
        stage += 1;

        if (stage < introStages) {
          schedule(revealStage, 400);
          return;
        }

        if (data.dialogueAdvance === "continue") {
          openContinueDialogue(data, token);
          return;
        }

        const finishRest = () => {
          if (token !== runToken.current) return;
          if (skipRef.current) {
            finishTypingAndSpeak(id, token);
            return;
          }
          if (stage < stages.length) {
            typedRef.current = stages[stage];
            setTypedLength(stages[stage]);
            stage += 1;
            schedule(finishRest, 380);
            return;
          }
          setKuroMood(data.kuroMood || "happy");
          setPhase(PHASE.PROCESSING);
          schedule(() => {
            if (token !== runToken.current) return;
            setPhase(PHASE.RESPONSE);
            startDialogueReveal(response, token, () => {
              if (token !== runToken.current) return;
              setPhase(PHASE.READY);
            });
          }, 400);
        };
        finishRest();
      };

      setPhase(PHASE.TYPING);
      schedule(revealStage, 180);
    },
    [finishTypingAndSpeak, openContinueDialogue, schedule, startDialogueReveal]
  );

  const runLivingChapter = useCallback(
    (id) => {
      const data = ABOUT_CHAPTERS[id];
      const token = ++runToken.current;
      skipRef.current = false;
      clearTimers();

      setActiveId(id);
      setTypedLength(0);
      typedRef.current = 0;
      setRevealedCount(0);
      setStoryBeat(0);
      setKuroMood("focused");
      resetFinale();

      const lines = t(`chapters.${id}.response`, { returnObjects: true });
      const response = Array.isArray(lines) ? lines : [];

      if (reducedMotion) {
        setTypedLength(data.code.length);
        typedRef.current = data.code.length;
        setKuroMood(
          resolveMappedBeat(
            data.moodBeats,
            response.length,
            data.kuroMood || "happy"
          )
        );
        setRevealedCount(response.length);
        setStoryBeat((data.storyBeats?.length || 1) - 1);
        setPhase(PHASE.READY);
        if (data.hasFinale) beginFinale();
        return;
      }

      if (data.codeReveal === "stages" && data.codeStages?.length) {
        runStagedChapter(id, data, token, response);
        return;
      }

      setPhase(PHASE.TYPING);
      const total = data.code.length;
      const gate = Math.floor(total * (data.kuroGate ?? 0.7));
      const step = Math.max(1, Math.floor(total / 72));
      let pos = 0;
      let kuroStarted = false;
      let dialogueDone = false;
      let typingDone = false;

      const tryReady = () => {
        if (token !== runToken.current) return;
        if (typingDone && dialogueDone) setPhase(PHASE.READY);
      };

      const typeTick = () => {
        if (token !== runToken.current) return;
        if (skipRef.current) {
          finishTypingAndSpeak(id, token);
          return;
        }
        pos = Math.min(total, pos + step);
        typedRef.current = pos;
        setTypedLength(pos);

        if (!kuroStarted && pos >= gate) {
          kuroStarted = true;
          setKuroMood(data.kuroMood || "happy");
          setPhase(PHASE.PROCESSING);
          schedule(() => {
            if (token !== runToken.current) return;
            setPhase(PHASE.RESPONSE);
            startDialogueReveal(response, token, () => {
              dialogueDone = true;
              tryReady();
            });
          }, 400);
        }

        if (pos < total) {
          schedule(typeTick, 22);
        } else {
          typingDone = true;
          if (!kuroStarted) {
            finishTypingAndSpeak(id, token);
          } else {
            tryReady();
          }
        }
      };
      schedule(typeTick, 160);
    },
    [
      beginFinale,
      clearTimers,
      finishTypingAndSpeak,
      reducedMotion,
      resetFinale,
      runStagedChapter,
      schedule,
      startDialogueReveal,
      t,
    ]
  );

  const runLockedChapter = useCallback(
    (id) => {
      ++runToken.current;
      clearTimers();
      resetFinale();
      const data = ABOUT_CHAPTERS[id];
      setActiveId(id);
      setTypedLength(data.code.length);
      typedRef.current = data.code.length;
      setRevealedCount(999);
      setStoryBeat(0);
      setKuroMood("focused");
      setPhase(PHASE.LOCKED);
    },
    [clearTimers, resetFinale]
  );

  const runChapter = useCallback(
    (id) => {
      if (LIVING_CHAPTER_IDS.has(id)) runLivingChapter(id);
      else runLockedChapter(id);
    },
    [runLivingChapter, runLockedChapter]
  );

  useEffect(() => {
    if (!booted) return undefined;
    runChapter("identity");
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot / locale gate
  }, [booted, i18n.language]);

  const onSkip = useCallback(() => {
    if (phase !== PHASE.TYPING && phase !== PHASE.PROCESSING && phase !== PHASE.RESPONSE)
      return;
    const data = ABOUT_CHAPTERS[activeId];
    if (data?.dialogueAdvance === "continue" && phase === PHASE.RESPONSE) {
      skipRef.current = true;
      finishTypingAndSpeak(activeId, runToken.current);
      return;
    }
    if (phase === PHASE.TYPING || phase === PHASE.PROCESSING) {
      skipRef.current = true;
      finishTypingAndSpeak(activeId, runToken.current);
    }
  }, [activeId, finishTypingAndSpeak, phase]);

  const onContinue = useCallback(() => {
    const data = ABOUT_CHAPTERS[activeId];
    if (!data?.storyBeats?.length || data.dialogueAdvance !== "continue") return;
    if (phase !== PHASE.RESPONSE) return;
    const next = storyBeat + 1;
    if (next >= data.storyBeats.length) {
      setPhase(PHASE.READY);
      if (data.hasFinale) beginFinale();
      return;
    }
    const applied = applyBeat(data, next);
    if (applied?.isLast) {
      setPhase(PHASE.READY);
      if (data.hasFinale) beginFinale();
    }
  }, [activeId, applyBeat, beginFinale, phase, storyBeat]);

  const onReplay = useCallback(() => {
    if (!LIVING_CHAPTER_IDS.has(activeId)) return;
    runLivingChapter(activeId);
  }, [activeId, runLivingChapter]);

  const onFinaleOpenChoices = useCallback(() => {
    if (finalePhase !== FINALE_PHASE.IDLE) return;
    setFinalePhase(FINALE_PHASE.CHOOSING);
  }, [finalePhase]);

  const onFinaleSelect = useCallback(
    (id) => {
      if (finalePhase !== FINALE_PHASE.CHOOSING && finalePhase !== FINALE_PHASE.SELECTED)
        return;
      if (!getFinaleChoice(id)) return;
      setFinaleChoiceId(id);
      setFinalePhase(FINALE_PHASE.SELECTED);
    },
    [finalePhase]
  );

  const onFinaleRun = useCallback(() => {
    if (finalePhase !== FINALE_PHASE.SELECTED || !finaleChoiceId) return;
    if (epilogueStarted.current) return;
    const choice = getFinaleChoice(finaleChoiceId);
    if (!choice) return;

    epilogueStarted.current = true;
    const line = choice.code;
    const reaction = t(`workstation.finale.choices.${choice.id}.kuro`);
    setEpilogue(line);
    setFinaleReaction(reaction);
    setFinaleMood("excited");
    setFinaleBeat("bounce");
    setFinalePhase(FINALE_PHASE.REVEALING);
    setShowContinued(false);

    const token = runToken.current;

    if (reducedMotion) {
      setEpilogueLength(line.length);
      schedule(() => {
        if (token !== runToken.current) return;
        setFinaleMood("happy");
        setFinaleBeat("wave");
        setShowContinued(true);
        setFinalePhase(FINALE_PHASE.COMPLETED);
      }, 200);
      return;
    }

    let pos = 0;
    const step = Math.max(1, Math.floor(line.length / 18));
    const typeEpi = () => {
      if (token !== runToken.current) return;
      pos = Math.min(line.length, pos + step);
      setEpilogueLength(pos);
      if (pos < line.length) {
        schedule(typeEpi, 28);
        return;
      }
      schedule(() => {
        if (token !== runToken.current) return;
        setFinaleMood("happy");
        setFinaleBeat("wave");
        setShowContinued(true);
        setFinalePhase(FINALE_PHASE.COMPLETED);
      }, 700);
    };
    schedule(typeEpi, 80);
  }, [finaleChoiceId, finalePhase, reducedMotion, schedule, t]);

  const onReplayEnding = useCallback(() => {
    if (activeId !== "vision") return;
    clearTimers();
    epilogueStarted.current = false;
    setFinaleChoiceId(null);
    setEpilogue("");
    setEpilogueLength(0);
    setShowContinued(false);
    setFinaleReaction("");
    setFinaleMood("excited");
    setFinaleBeat("idle");
    setFinalePhase(FINALE_PHASE.IDLE);
    const data = ABOUT_CHAPTERS.vision;
    typedRef.current = data.code.length;
    setTypedLength(data.code.length);
  }, [activeId, clearTimers]);

  const creatorName = t("workstation.creatorName");
  const creatorRole = t("workstation.creatorRole");
  const finaleActive = finalePhase !== FINALE_PHASE.OFF;
  const speaking =
    phase === PHASE.RESPONSE ||
    phase === PHASE.READY ||
    finalePhase === FINALE_PHASE.REVEALING ||
    finalePhase === FINALE_PHASE.COMPLETED;
  const chapterData = ABOUT_CHAPTERS[activeId];
  const storyMood = resolveMappedBeat(
    chapterData?.moodBeats,
    revealedCount,
    kuroMood
  );
  const displayMood =
    phase === PHASE.TYPING
      ? "focused"
      : phase === PHASE.LOCKED
        ? "focused"
        : finaleMood || storyMood;
  const kuroBeat = finaleActive
    ? finaleBeat
    : speaking
      ? resolveMappedBeat(
          chapterData?.reactionBeats,
          revealedCount,
          chapterData?.defaultBeat || "idle"
        )
      : "idle";
  const chapterIndex =
    CHAPTERS.find((c) => c.id === activeId)?.index ?? "01";
  const canContinue =
    chapter.living &&
    chapter.dialogueAdvance === "continue" &&
    phase === PHASE.RESPONSE &&
    storyBeat < (chapter.storyBeats?.length || 0) - 1;
  const showFinaleCursor =
    finalePhase === FINALE_PHASE.IDLE ||
    finalePhase === FINALE_PHASE.CHOOSING ||
    finalePhase === FINALE_PHASE.SELECTED;

  return (
    <section
      id="about-workstation"
      className="section-container scroll-mt-28 bg-[#060606] pb-16 pt-20 md:pt-28"
      aria-labelledby="about-workstation-title"
      lang={i18n.language}
    >
      <div className="mb-8 max-w-2xl">
        <p
          className={`text-purple-neon ${
            isFa ? "font-heading text-sm tracking-normal" : "font-heading text-sm uppercase tracking-[0.3em]"
          }`}
        >
          {t("workstation.eyebrow")}
        </p>
        <h1
          id="about-workstation-title"
          className={`mt-3 font-black text-white ${
            isFa ? "text-3xl leading-snug md:text-5xl" : "text-3xl md:text-5xl"
          }`}
        >
          {t("workstation.titleLead")}{" "}
          <span className="bg-gradient-to-r from-cyan-neon via-purple-neon to-magenta-neon bg-clip-text text-transparent">
            {t("workstation.titleAccent")}
          </span>
        </h1>
        <p className={`mt-4 text-slate-400 ${isFa ? "leading-[1.9]" : ""}`}>
          {t("workstation.intro", { robot: ABOUT_CREATOR.robotName })}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] items-center justify-center rounded-2xl border border-cyan-neon/25 bg-panel/80 p-10 shadow-neon-cyan backdrop-blur-md"
          >
            <div className="w-full max-w-md font-mono text-sm text-cyan-neon" dir="auto">
              {bootLines.slice(0, bootLine + 1).map((line) => (
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
            className="rounded-2xl border border-cyan-neon/25 bg-panel/75 p-3 shadow-neon-cyan backdrop-blur-md md:p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-neon/10 pb-3">
              <div>
                <p
                  className={`text-slate-500 ${
                    isFa ? "font-heading text-[11px]" : "font-mono text-[10px] uppercase tracking-[0.3em]"
                  }`}
                >
                  {t("workstation.session", { name: creatorName })}
                </p>
                <p
                  className={`text-white ${
                    isFa ? "font-heading text-sm tracking-normal" : "font-heading text-sm uppercase tracking-widest"
                  }`}
                >
                  {creatorRole}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(phase === PHASE.TYPING || phase === PHASE.PROCESSING) && chapter.living && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-md border border-cyan-neon/35 bg-cyan-neon/10 px-3 py-1.5 font-heading text-xs text-cyan-neon transition hover:bg-cyan-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-neon"
                  >
                    {t("workstation.controls.skip")}
                  </button>
                )}
                {canContinue && (
                  <button
                    type="button"
                    onClick={onContinue}
                    className="rounded-md border border-emerald-neon/40 bg-emerald-neon/10 px-3 py-1.5 font-heading text-xs text-emerald-neon transition hover:bg-emerald-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-neon"
                  >
                    {t("workstation.controls.continue")}
                  </button>
                )}
                {phase === PHASE.RESPONSE && chapter.dialogueAdvance === "continue" && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-md border border-cyan-neon/35 bg-cyan-neon/10 px-3 py-1.5 font-heading text-xs text-cyan-neon transition hover:bg-cyan-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-neon"
                  >
                    {t("workstation.controls.skip")}
                  </button>
                )}
                {phase === PHASE.READY && chapter.living && !finaleActive && (
                  <button
                    type="button"
                    onClick={onReplay}
                    className="rounded-md border border-purple-neon/35 bg-purple-neon/10 px-3 py-1.5 font-heading text-xs text-purple-neon transition hover:bg-purple-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-neon"
                  >
                    {t("workstation.controls.replay")}
                  </button>
                )}
                {phase === PHASE.RESPONSE &&
                  chapter.living &&
                  chapter.dialogueAdvance !== "continue" && (
                  <button
                    type="button"
                    onClick={onReplay}
                    className="rounded-md border border-purple-neon/35 bg-purple-neon/10 px-3 py-1.5 font-heading text-xs text-purple-neon transition hover:bg-purple-neon/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-neon"
                  >
                    {t("workstation.controls.replay")}
                  </button>
                )}
                <p className="font-mono text-[10px] text-emerald-neon" dir="ltr">
                  chapter = {chapterIndex}
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[150px_minmax(0,1.2fr)_minmax(0,0.95fr)] lg:items-stretch">
              <div className="order-1 lg:order-none">
                <AboutChapterRail
                  chapters={chapters}
                  activeId={activeId}
                  onSelect={runChapter}
                  reducedMotion={reducedMotion}
                  label={t("workstation.railLabel")}
                />
              </div>

              <div className="order-2 min-h-0 lg:order-none">
                <CodeEditor
                  chapter={chapter}
                  isTyping={phase === PHASE.TYPING}
                  typedLength={typedLength}
                  progress={typeProgress}
                  epilogue={epilogue}
                  epilogueLength={epilogueLength}
                  showEndCursor={showFinaleCursor}
                  showContinued={showContinued}
                />
              </div>

              <div className="order-3 flex min-h-0 flex-col gap-4 lg:order-none">
                <AIResponsePanel
                  chapter={chapter}
                  phase={phase === PHASE.LOCKED ? "ready" : phase}
                  reducedMotion={reducedMotion || phase === PHASE.LOCKED}
                  revealedCount={revealedCount}
                  locked={phase === PHASE.LOCKED}
                  showContinueHint={canContinue}
                />
                {chapter.hasFinale && (
                  <UnwrittenLineFinale
                    phase={finalePhase}
                    selectedId={finaleChoiceId}
                    reaction={finaleReaction}
                    onOpenChoices={onFinaleOpenChoices}
                    onSelect={onFinaleSelect}
                    onRun={onFinaleRun}
                    onReplayEnding={onReplayEnding}
                    reducedMotion={reducedMotion}
                  />
                )}
                <div className="hidden justify-center lg:flex">
                  <AboutRobotGuide
                    mood={displayMood}
                    speaking={speaking && chapter.living}
                    beat={kuroBeat}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center lg:hidden">
              <AboutRobotGuide
                mood={displayMood}
                speaking={speaking && chapter.living}
                beat={kuroBeat}
              />
            </div>

            <div className="mt-4">
              <SystemStatusBar chapterLabel={chapterMeta?.label ?? ""} phase={phase === PHASE.LOCKED ? "ready" : phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
