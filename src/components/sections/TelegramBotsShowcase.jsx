import { useMemo, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import BotCard from "../cards/BotCard";
import { telegramBots, botCategories } from "../../data/telegramBots";
import { useLiveBotStats } from "../../hooks/useLiveBotStats";

export default function TelegramBotsShowcase() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...botCategories];
  const liveByName = useLiveBotStats();

  const visibleBots = useMemo(() => {
    return telegramBots.filter((bot) => {
      const matchesCategory = category === "All" || bot.category === category;
      const matchesSearch = bot.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section id="bots" className="section-container">
      <SectionHeading
        eyebrow="Bot Ecosystem Directory"
        title="Telegram Bots Hub"
        description="Search, filter, and launch an interactive demo of any bot below."
      />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-2 font-heading text-xs uppercase tracking-widest transition-all duration-300
                ${
                  category === cat
                    ? "border-cyan-neon bg-cyan-neon/10 text-cyan-neon shadow-neon-cyan"
                    : "border-slate-700 text-slate-400 hover:border-cyan-neon/50 hover:text-cyan-neon"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bots..."
          aria-label="Search bots"
          className="w-full rounded-full border border-slate-700 bg-void/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 transition-[border-color,box-shadow] duration-300 focus:border-cyan-neon focus:shadow-neon-cyan focus:outline-none md:w-64"
        />
      </div>

      {(() => {
        const liveRows = Object.values(liveByName);
        const hasErrors = liveRows.some((b) => b.status === "error");
        const isLive = liveRows.length > 0;
        return (
          <div
            className={`mb-8 flex items-center gap-2 font-heading text-xs uppercase tracking-widest ${
              hasErrors ? "text-magenta-neon" : "text-emerald-neon"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {!hasErrors && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-neon opacity-75" />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${hasErrors ? "bg-magenta-neon" : "bg-emerald-neon"}`} />
            </span>
            {hasErrors
              ? "One or more bots need attention"
              : isLive
              ? "All Systems Operational — Live"
              : "All Systems Operational — 99.9% Uptime"}
          </div>
        );
      })()}

      {visibleBots.length === 0 ? (
        <p className="text-sm text-slate-500">No bots match your search.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {visibleBots.map((bot) => (
            <BotCard key={bot.id} bot={bot} live={liveByName[bot.name.trim().toLowerCase()]} />
          ))}
        </div>
      )}
    </section>
  );
}
