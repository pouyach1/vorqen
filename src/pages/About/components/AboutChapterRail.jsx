import { memo } from "react";

function AboutChapterRail({ chapters, activeId, onSelect, reducedMotion }) {
  return (
    <nav
      aria-label="About chapters"
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
    >
      {chapters.map((chapter) => {
        const active = chapter.id === activeId;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onSelect(chapter.id)}
            aria-current={active ? "true" : undefined}
            className={`group flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-neon ${
              active
                ? "border-cyan-neon/50 bg-cyan-neon/10 text-cyan-neon"
                : "border-transparent bg-transparent text-slate-500 hover:border-cyan-neon/20 hover:text-slate-300"
            }`}
          >
            <span
              className={`font-mono text-[10px] tracking-widest ${
                active ? "text-cyan-neon" : "text-slate-600 group-hover:text-slate-400"
              }`}
            >
              {chapter.index}
            </span>
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.18em]">
              {chapter.label}
            </span>
            {active && !reducedMotion && (
              <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-cyan-neon shadow-neon-cyan lg:inline-block" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default memo(AboutChapterRail);
