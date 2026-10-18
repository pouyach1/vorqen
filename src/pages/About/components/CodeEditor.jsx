import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ABOUT_CREATOR } from "../../../data/aboutWorkstation";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function CodeEditor({
  chapter,
  isTyping,
  typedLength,
  progress = 0,
  epilogue = "",
  epilogueLength = 0,
  showEndCursor = false,
  showContinued = false,
}) {
  const { t } = useTranslation("about");
  const reducedMotion = usePrefersReducedMotion();
  const code = chapter.code ?? "";

  const visible = useMemo(() => {
    let base = code;
    if (!reducedMotion && typedLength < code.length) {
      base = code.slice(0, Math.max(0, typedLength));
    }
    const epi =
      epilogue && epilogueLength > 0
        ? `\n${epilogue.slice(0, Math.min(epilogueLength, epilogue.length))}`
        : "";
    const continued = showContinued ? "\n\n// To be continued..." : "";
    return `${base}${epi}${continued}`;
  }, [code, typedLength, reducedMotion, epilogue, epilogueLength, showContinued]);

  const lines = visible.split("\n");
  const pct = Math.min(100, Math.round(progress * 100));
  const typingEpilogue =
    Boolean(epilogue) && epilogueLength > 0 && epilogueLength < epilogue.length;
  const showCursor =
    !reducedMotion &&
    (showEndCursor || typingEpilogue || (typedLength < code.length && !epilogueLength));

  return (
    <div
      dir="ltr"
      className="relative flex h-full min-h-[320px] max-h-[min(520px,70vh)] flex-col overflow-hidden rounded-xl border border-cyan-neon/30 bg-[#030810] shadow-[0_0_40px_rgba(0,243,255,0.08)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.35) 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-cyan-neon/15 via-transparent to-purple-neon/10"
      />

      <div className="relative z-[2] flex items-center gap-2 border-b border-cyan-neon/15 bg-[#060d18]/95 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-magenta-neon/80 shadow-[0_0_8px_rgba(255,0,127,0.5)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-purple-neon/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-neon/80" />
        <span className="ms-3 truncate font-mono text-[10px] text-slate-400">
          {chapter.filePath || ABOUT_CREATOR.filePath}
        </span>
        <span className="ms-auto rounded border border-cyan-neon/25 bg-cyan-neon/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-neon/80">
          {isTyping || typingEpilogue || showCursor
            ? t("workstation.terminal.writing")
            : t("workstation.terminal.idle")}
        </span>
      </div>

      <div className="relative z-[2] border-b border-cyan-neon/10 px-4 py-2">
        <p className="font-mono text-xs text-emerald-neon">{chapter.prompt}</p>
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-neon to-purple-neon"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.15, ease: "linear" }}
          />
        </div>
      </div>

      <div className="relative z-[2] flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 md:text-xs">
        <pre className="whitespace-pre-wrap">
          {lines.map((line, i) => (
            <div key={`${chapter.id}-L${i}-${line.slice(0, 12)}`} className="flex gap-3">
              <span className="w-6 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
              <span>
                {highlightLine(line)}
                {i === lines.length - 1 && showCursor && (
                  <motion.span
                    aria-hidden
                    className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan-neon align-middle shadow-[0_0_10px_rgba(0,243,255,0.8)]"
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 0.65, repeat: Infinity }}
                  />
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function highlightLine(line) {
  if (!line) return "\u00A0";
  if (line.trimStart().startsWith("//")) {
    return <span className="text-slate-500">{line}</span>;
  }
  const keywordRe =
    /(\bconst\b|\blet\b|\bclass\b|\basync\b|\bfunction\b|\bexport\b|\bawait\b|\bdefault\b|\breturn\b|\bfor\b|\bnew\b|\bif\b|\btry\b|\bcatch\b|\bthrow\b)/g;
  if (keywordRe.test(line)) {
    keywordRe.lastIndex = 0;
    return line.split(keywordRe).map((part, i) =>
      /^(const|let|class|async|function|export|await|default|return|for|new|if|try|catch|throw)$/.test(
        part
      ) ? (
        <span key={i} className="text-purple-neon">
          {part}
        </span>
      ) : part.includes('"') ? (
        part.split(/("[^"]*")/g).map((bit, j) =>
          bit.startsWith('"') ? (
            <span key={`${i}-${j}`} className="text-emerald-neon">
              {bit}
            </span>
          ) : (
            <span key={`${i}-${j}`}>{bit}</span>
          )
        )
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }
  if (line.includes('"')) {
    return line.split(/("[^"]*")/g).map((part, i) =>
      part.startsWith('"') ? (
        <span key={i} className="text-emerald-neon">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }
  return line;
}

export default memo(CodeEditor);
export { usePrefersReducedMotion };
