import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * The portfolio's bot cards ship with curated marketing copy (badge,
 * description, feature pills) that lives in src/data/telegramBots.js and
 * has no real-time meaning — that content stays static on purpose.
 *
 * This hook only overlays the OPERATIONAL numbers (status, active users,
 * latency, uptime) from the same `bots` table the admin panel manages,
 * matched by bot name (case-insensitive). If a bot's name in
 * telegramBots.js doesn't match any row in Supabase, or Supabase isn't
 * configured at all, that card simply keeps its static demo numbers —
 * nothing breaks.
 */
export function useLiveBotStats() {
  const [liveByName, setLiveByName] = useState({});

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase
      .from("bots")
      .select("name, status, active_users, latency_ms, uptime_percent")
      .then(({ data }) => {
        if (!data) return;
        const map = {};
        data.forEach((row) => {
          map[row.name.trim().toLowerCase()] = row;
        });
        setLiveByName(map);
      });
  }, []);

  return liveByName;
}
