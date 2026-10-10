"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { getAdmin, serverClient } from "@/lib/supabase/server";
import { serviceClient } from "@/lib/supabase/service";
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

/** Emails a link for choosing a new password. Same answer whether or not the email exists. */
export async function requestPasswordReset(_prev: ActionState, data: FormData): Promise<ActionState> {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, message: "נא לכתוב את כתובת המייל." };
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const supabase = await serverClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/auth/confirm` });
  if (error?.status === 429) return { ok: false, message: "נשלחו כבר כמה מיילים. נסי שוב בעוד שעה." };
  return { ok: true, message: "אם הכתובת רשומה, נשלח אלייך מייל עם קישור לבחירת סיסמה חדשה. כדאי לפתוח אותו באותו מכשיר ובאותו דפדפן." };
}

export async function setNewPassword(_prev: ActionState, data: FormData): Promise<ActionState> {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "הקישור פג תוקף. בקשי קישור חדש מעמוד הכניסה." };
  const password = String(data.get("password") ?? "");
  if (password.length < 10) return { ok: false, message: "הסיסמה צריכה להיות באורך 10 תווים לפחות." };
  if (password !== String(data.get("confirm") ?? "")) return { ok: false, message: "הסיסמאות לא זהות." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: "השמירה לא הצליחה. נסי סיסמה אחרת." };
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

// ---------- students & tasks ----------

export async function createStudent(_prev: ActionState, data: FormData): Promise<ActionState> {
  await requireAdmin();
  const service = serviceClient();
  if (!service) return { ok: false, message: "חסר מפתח ניהול של מסד הנתונים." };

  const name = String(data.get("name") ?? "").trim().slice(0, 80);
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const password = String(data.get("password") ?? "");
  if (!name || !email.includes("@")) return { ok: false, message: "נא למלא שם ומייל." };
  if (password.length < 8) return { ok: false, message: "הסיסמה צריכה להיות באורך 8 תווים לפחות." };

  const { data: created, error } = await service.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !created.user) {
    const taken = /already|registered|exists/i.test(error?.message ?? "");
    return {
      ok: false,
      message: taken
        ? "המייל הזה כבר רשום. לאחים עם אותו מייל של הורה אפשר להוסיף +שם לפני ה-@, למשל parent+noa@gmail.com."
        : "יצירת החשבון נכשלה.",
    };
  }
  const { error: rowError } = await service
    .from("students")
    .insert({ user_id: created.user.id, name, login_email: email });
  if (rowError) {
    await service.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: "שמירת התלמיד נכשלה." };
  }
  revalidatePath("/admin", "layout");
  return { ok: true, message: `${name} נוסף/ה ✅` };
}

export async function resetStudentPassword(_prev: ActionState, data: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const service = serviceClient();
  if (!service) return { ok: false, message: "חסר מפתח ניהול של מסד הנתונים." };
  const password = String(data.get("password") ?? "");
  if (password.length < 8) return { ok: false, message: "הסיסמה צריכה להיות באורך 8 תווים לפחות." };

  const { data: student } = await supabase.from("students").select("user_id").eq("id", String(data.get("id"))).single();
  if (!student) return { ok: false, message: "התלמיד לא נמצא." };
  const { error } = await service.auth.admin.updateUserById(student.user_id, { password });
  return error ? { ok: false, message: "שינוי הסיסמה נכשל." } : { ok: true, message: "הסיסמה עודכנה ✅" };
}

export async function deleteStudent(data: FormData) {
  const supabase = await requireAdmin();
  const service = serviceClient();
  const { data: student } = await supabase.from("students").select("user_id").eq("id", String(data.get("id"))).single();
  // Removing the login account also removes the student and their tasks.
  if (student && service) await service.auth.admin.deleteUser(student.user_id);
  revalidatePath("/admin", "layout");
  redirect("/admin/students");
}

export async function addTask(data: FormData) {
  const supabase = await requireAdmin();
  const title = String(data.get("title") ?? "").trim().slice(0, 200);
  if (!title) return;
  await supabase.from("tasks").insert({
    student_id: String(data.get("student_id")),
    title,
    instructions: String(data.get("instructions") ?? "").trim().slice(0, 6000) || null,
    due_date: String(data.get("due_date") ?? "") || null,
    answer_requested: data.get("answer_requested") === "on",
  });
  revalidatePath("/admin", "layout");
}

export async function saveFeedback(data: FormData) {
  const supabase = await requireAdmin();
  await supabase
    .from("tasks")
    .update({ feedback: String(data.get("feedback") ?? "").trim().slice(0, 4000) || null })
    .eq("id", String(data.get("id")));
  revalidatePath("/admin", "layout");
}

export async function reopenTask(data: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("tasks").update({ status: "open", done_at: null }).eq("id", String(data.get("id")));
  revalidatePath("/admin", "layout");
}

export async function deleteTask(data: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("tasks").delete().eq("id", String(data.get("id")));
  revalidatePath("/admin", "layout");
}
