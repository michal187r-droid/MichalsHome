import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { studentSignOut } from "./actions";
import TaskForm from "./TaskForm";

type Task = {
  id: string;
  title: string;
  instructions: string | null;
  due_date: string | null;
  answer_requested: boolean;
  status: "open" | "done";
  answer: string | null;
  feedback: string | null;
};

const dateOnly = (d: string) => new Intl.DateTimeFormat("he-IL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(d));

export default async function StudentHome() {
  if (!supabaseConfigured) redirect("/student/login");
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/student/login");

  const { data: student } = await supabase.from("students").select("id, name").eq("user_id", user.id).single();
  if (!student) {
    return (
      <div className="admin-login">
        <div className="admin-card">
          <h1>אין כאן אזור אישי</h1>
          <p>החשבון הזה לא מחובר לתלמיד. אפשר לפנות למיכל.</p>
          <form action={studentSignOut}>
            <button className="admin-btn ghost">יציאה</button>
          </form>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("tasks")
    .select("id, title, instructions, due_date, answer_requested, status, answer, feedback")
    .eq("student_id", student.id)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  const tasks = (data ?? []) as Task[];
  const open = tasks.filter((t) => t.status === "open");
  const done = tasks.filter((t) => t.status === "done").reverse();

  return (
    <>
      <header className="admin-bar">
        <span className="admin-brand">הבית של מיכל · האזור של {student.name}</span>
        <form action={studentSignOut}>
          <button type="submit" className="admin-btn ghost">
            יציאה
          </button>
        </form>
      </header>
      <main className="admin-main">
        <h1>היי {student.name} 👋</h1>
        <p className="admin-hint">
          {open.length ? `יש לך ${open.length} משימות. בהצלחה! 💪` : "אין משימות פתוחות כרגע. כל הכבוד! 🎉"}
        </p>

        <div className="admin-list">
          {open.map((t) => (
            <article key={t.id} className="admin-item status-new">
              <div className="item-top">
                <h2>{t.title}</h2>
                {t.due_date && <span className="pill pill-contacted">להגשה עד {dateOnly(t.due_date)}</span>}
              </div>
              {t.instructions && <p className="item-message">{t.instructions}</p>}
              <TaskForm id={t.id} answerRequested={t.answer_requested} />
            </article>
          ))}
        </div>

        {done.length > 0 && (
          <>
            <h2 style={{ marginTop: 32 }}>משימות שסיימתי ✅</h2>
            <div className="admin-list">
              {done.map((t) => (
                <details key={t.id} className="admin-item">
                  <summary className="item-top">
                    <h2>{t.title}</h2>
                    {t.feedback && <span className="pill pill-new">💬 יש משוב ממיכל</span>}
                  </summary>
                  {t.answer && (
                    <>
                      <p className="task-answer-label">מה כתבתי:</p>
                      <p className="item-message">{t.answer}</p>
                    </>
                  )}
                  {t.feedback && (
                    <>
                      <p className="task-answer-label">משוב ממיכל:</p>
                      <p className="item-message feedback">{t.feedback}</p>
                    </>
                  )}
                </details>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
