import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * MUST point at the exact same Supabase project as cyber-admin-ai (the
 * admin panel). Two things use this connection:
 *   1. useTrackPageView — logs anonymous visits to `site_visits`, which
 *      powers the real traffic chart in the admin dashboard.
 *   2. useLiveBotStats — optionally overlays live operational numbers
 *      (status/active users/latency) from the `bots` table onto the
 *      static bot cards in TelegramBotsShowcase.
 *
 * Until `.env.local` is set (see .env.example), both hooks no-op safely —
 * the site works exactly as before, just without the live data layer.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
