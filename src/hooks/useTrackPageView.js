import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

function getSessionId() {
  // A random per-browser id — NOT a cookie, not tied to any account or
  // personal identity, cleared whenever the tab's sessionStorage clears.
  // Only used so the admin dashboard can distinguish "unique visitors"
  // from "total page views" in aggregate.
  const key = "cyberdev_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Logs one anonymous visit on mount. Call once from App.jsx. No-ops
 * completely when Supabase isn't configured, so local dev is unaffected.
 */
export function useTrackPageView() {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.from("site_visits").insert({
      path: window.location.pathname + window.location.hash,
      referrer: document.referrer || null,
      session_id: getSessionId(),
    });
    // Intentionally runs once per full page load, not per hash-change —
    // this is a single-page site, so "a visit" means "someone opened it."
  }, []);
}
