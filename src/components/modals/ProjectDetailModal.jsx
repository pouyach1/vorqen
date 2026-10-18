import { useState } from "react";
import ModalShell from "./ModalShell";
import NeonButton from "../ui/NeonButton";
import { useAppStore } from "../../store/useAppStore";
import { webProjects } from "../../data/webProjects";

const SCORE_LABELS = {
  performance: "Performance",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
  seo: "SEO",
};

export default function ProjectDetailModal() {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const closeProjectDetail = useAppStore((s) => s.closeProjectDetail);
  const project = webProjects.find((p) => p.id === activeProjectId);
  const [device, setDevice] = useState("desktop");

  if (!project) return <ModalShell open={false} onClose={closeProjectDetail} />;

  return (
    <ModalShell open={!!activeProjectId} onClose={closeProjectDetail} glow="cyan" wide>
      <div className="p-6">
        <div className="mb-2 pr-10">
          <p className="font-heading text-xs uppercase tracking-widest text-cyan-neon">Case Study</p>
          <h3 className="font-display text-2xl font-bold text-white">{project.title}</h3>
        </div>

        {/* Device frame preview */}
        <div className="my-6">
          <div className="mb-3 flex gap-2">
            {["desktop", "mobile"].map((mode) => (
              <button
                key={mode}
                onClick={() => setDevice(mode)}
                className={`rounded-full border px-4 py-1.5 font-heading text-xs uppercase tracking-widest ${
                  device === mode
                    ? "border-cyan-neon bg-cyan-neon/10 text-cyan-neon"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div
            className={`mx-auto overflow-hidden rounded-xl border border-slate-700 ${
              device === "desktop" ? "h-56 w-full" : "h-72 w-40"
            }`}
          >
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="text-sm text-slate-300">{project.brief}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-heading text-sm uppercase tracking-widest text-purple-neon">
              Challenges Solved
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {project.challenges.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-cyan-neon">▹</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-heading text-sm uppercase tracking-widest text-purple-neon">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm">
              {project.architecture.map((a) => (
                <li key={a.layer}>
                  <span className="font-heading text-cyan-neon">{a.layer}:</span>{" "}
                  <span className="text-slate-400">{a.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 font-heading text-sm uppercase tracking-widest text-purple-neon">
            Live Performance Scorecard
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(SCORE_LABELS).map(([key, label]) => (
              <div key={key} className="rounded-xl border border-slate-700 p-4 text-center">
                <p className="font-display text-2xl font-black text-emerald-neon">
                  {project.performance[key]}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Load time: {project.performance.loadTime}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <NeonButton as="a" href={project.liveUrl} variant="cyan">
            Visit Live Site
          </NeonButton>
          <NeonButton as="a" href={project.githubUrl} variant="purple">
            Inspect Code / Figma
          </NeonButton>
        </div>
      </div>
    </ModalShell>
  );
}
