import { publicClient } from "@/lib/supabase/public";

// Called once a day by a Vercel cron job (vercel.json) so the free Supabase
// database never goes to sleep for inactivity.
export async function GET() {
  const supabase = publicClient();
  if (!supabase) return Response.json({ ok: false, reason: "not configured" });
  const { error } = await supabase.from("site_content").select("key").limit(1);
  return Response.json({ ok: !error });
}
