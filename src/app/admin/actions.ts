"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { getAdmin, serverClient } from "@/lib/supabase/server";
import { CONTENT_TAG, QUESTIONS_TAG } from "@/lib/supabase/public";
import { CONTENT_KEYS, type ContentKey } from "@/lib/content";

export type ActionState = { ok: boolean; message?: string } | null;

async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin.supabase;
}

// ---------- login ----------

export async function signIn(_prev: ActionState, data: FormData): Promise<ActionState> {
  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(data.get("email") ?? "").trim().toLowerCase(),
    password: String(data.get("password") ?? ""),
  });
  if (error) return { ok: false, message: "המייל או הסיסמה לא נכונים." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- leads ----------

const LEAD_STATUSES = ["new", "contacted", "closed"];

export async function updateLead(data: FormData) {
  const supabase = await requireAdmin();
  const status = String(data.get("status") ?? "new");
  await supabase
    .from("leads")
    .update({
      status: LEAD_STATUSES.includes(status) ? status : "new",
      notes: String(data.get("notes") ?? "").trim().slice(0, 4000) || null,
    })
    .eq("id", String(data.get("id")));
  revalidatePath("/admin", "layout");
}

export async function deleteLead(data: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("leads").delete().eq("id", String(data.get("id")));
  revalidatePath("/admin", "layout");
}

// ---------- questions ----------

export async function saveAnswer(data: FormData) {
  const supabase = await requireAdmin();
  const answer = String(data.get("answer") ?? "").trim().slice(0, 6000);
  const question = String(data.get("question") ?? "").trim().slice(0, 2000);
  const published = data.get("published") === "on" && answer.length > 0;
  await supabase
    .from("questions")
    .update({
      question: question || undefined,
      topic: String(data.get("topic") ?? "").trim().slice(0, 60) || null,
      answer: answer || null,
      published,
      answered_at: answer ? new Date().toISOString() : null,
    })
    .eq("id", String(data.get("id")));
  updateTag(QUESTIONS_TAG);
  revalidatePath("/admin", "layout");
}

export async function deleteQuestion(data: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("questions").delete().eq("id", String(data.get("id")));
  updateTag(QUESTIONS_TAG);
  revalidatePath("/admin", "layout");
}

// ---------- site text ----------

export async function saveContent(key: string, json: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!CONTENT_KEYS.includes(key as ContentKey)) return { ok: false, message: "חלק לא מוכר." };
  if (json.length > 300_000) return { ok: false, message: "הטקסט ארוך מדי." };

  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { ok: false, message: "שגיאה בנתונים." };
  }
  const expectList = key === "categories" || key === "testimonials";
  if (expectList !== Array.isArray(value) || typeof value !== "object" || value === null) {
    return { ok: false, message: "שגיאה בנתונים." };
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return { ok: false, message: "השמירה נכשלה. נסי שוב בעוד רגע." };

  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "נשמר! האתר מתעדכן." };
}

/** Undo all edits to a section and go back to the built-in text. */
export async function resetContent(key: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!CONTENT_KEYS.includes(key as ContentKey)) return { ok: false, message: "חלק לא מוכר." };
  await supabase.from("site_content").delete().eq("key", key);
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "הוחזר לטקסט המקורי." };
}
