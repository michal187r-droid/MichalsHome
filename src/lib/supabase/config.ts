// Connection details come from the Supabase ↔ Vercel integration.
// Locally they may be missing; the site then falls back to built-in content.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
