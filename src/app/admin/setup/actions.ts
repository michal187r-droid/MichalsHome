"use server";

import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import { stage2Migration } from "@/lib/db/migration";
import { supabaseUrl } from "@/lib/supabase/config";

export type SetupState = { ok: boolean; message: string } | null;

const ADMIN_EMAIL = "michal187r@gmail.com";

/**
 * Setup only works on Vercel preview deployments (which are behind Vercel's
 * login) or locally — never on the public production site.
 */
export async function setupAllowed() {
  return process.env.VERCEL_ENV !== "production";
}

export async function runMigration(): Promise<SetupState> {
  if (!(await setupAllowed())) return { ok: false, message: "לא זמין כאן." };
  const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
  if (!url) return { ok: false, message: "חסר חיבור למסד הנתונים." };

  const sql = postgres(url, { ssl: "require", max: 1, prepare: false });
  try {
    await sql.unsafe(stage2Migration);
    return { ok: true, message: "מסד הנתונים מוכן ✅" };
  } catch (e) {
    return { ok: false, message: `שגיאה: ${(e as Error).message}` };
  } finally {
    await sql.end();
  }
}

export async function setAdminPassword(_prev: SetupState, data: FormData): Promise<SetupState> {
  if (!(await setupAllowed())) return { ok: false, message: "לא זמין כאן." };
  const password = String(data.get("password") ?? "");
  if (password.length < 10) return { ok: false, message: "הסיסמה צריכה להיות באורך 10 תווים לפחות." };
  if (password !== String(data.get("confirm") ?? "")) return { ok: false, message: "הסיסמאות לא זהות." };

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!serviceKey) return { ok: false, message: "חסר מפתח ניהול של מסד הנתונים." };

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: list, error: listError } = await admin.auth.admin.listUsers();
  if (listError) return { ok: false, message: "שגיאה בגישה למשתמשים." };

  const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
  const { error } = existing
    ? await admin.auth.admin.updateUserById(existing.id, { password })
    : await admin.auth.admin.createUser({ email: ADMIN_EMAIL, password, email_confirm: true });
  if (error) return { ok: false, message: `שגיאה: ${error.message}` };
  return { ok: true, message: "הסיסמה נשמרה ✅ אפשר להיכנס לעמוד הניהול." };
}
