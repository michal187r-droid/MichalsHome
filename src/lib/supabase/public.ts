import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from "./config";

export const CONTENT_TAG = "content";
export const QUESTIONS_TAG = "questions";

/**
 * Anonymous client for public pages. Reads are cached by Next.js under the
 * given tag, and the admin panel expires the tag after every save.
 */
export function publicClient(tag?: string) {
  if (!supabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        tag
          ? fetch(input, { ...init, cache: "force-cache", next: { tags: [tag] } })
          : fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
