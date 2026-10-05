"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase/server";

export type StudentState = { ok: boolean; message?: string } | null;

export async function studentSignIn(_prev: StudentState, data: FormData): Promise<StudentState> {
  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(data.get("email") ?? "").trim().toLowerCase(),
    password: String(data.get("password") ?? ""),
  });
  if (error) return { ok: false, message: "המייל או הסיסמה לא נכונים. אפשר לבקש ממיכל סיסמה חדשה." };
  redirect("/student");
}

export async function studentSignOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/student/login");
}

export async function completeTask(_prev: StudentState, data: FormData): Promise<StudentState> {
  const supabase = await serverClient();
  const { data: ok, error } = await supabase.rpc("complete_task", {
    p_task: String(data.get("id")),
    p_answer: String(data.get("answer") ?? "").slice(0, 10000),
  });
  if (error || !ok) return { ok: false, message: "השמירה לא הצליחה. נסו שוב." };
  revalidatePath("/student");
  return { ok: true, message: "כל הכבוד! המשימה סומנה כבוצעה ✅ מיכל תקבל עדכון." };
}
