import "server-only";
import postgres from "postgres";
import { migrations } from "./migration";

/** Applies every migration in order. Callers check who is allowed first. */
export async function applyMigrations(): Promise<{ ok: boolean; message: string }> {
  const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
  if (!url) return { ok: false, message: "חסר חיבור למסד הנתונים." };

  const sql = postgres(url, { ssl: "require", max: 1, prepare: false });
  try {
    for (const m of migrations) await sql.unsafe(m);
    return { ok: true, message: "מסד הנתונים מוכן ✅" };
  } catch (e) {
    return { ok: false, message: `שגיאה: ${(e as Error).message}` };
  } finally {
    await sql.end();
  }
}
