import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { addTask, deleteStudent, deleteTask, reopenTask, saveFeedback } from "../../../actions";
import ConfirmButton from "../../../ConfirmButton";
import ResetPasswordForm from "./ResetPasswordForm";

type Task = {
  id: string;
  created_at: string;
  title: string;
  instructions: string | null;
  due_date: string | null;
  answer_requested: boolean;
  status: "open" | "done";
  answer: string | null;
  done_at: string | null;
  seen_by_admin: boolean;
  feedback: string | null;
};

const dateTime = new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" });
const dateOnly = (d: string) => new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeZone: "UTC" }).format(new Date(d));

export default async function StudentPage({ params }: PageProps<"/admin/students/[id]">) {
  const { id } = await params;
  const admin = (await getAdmin())!;
  const { data: student } = await admin.supabase.from("students").select("id, name, login_email").eq("id", id).single();
  if (!student) notFound();

  const { data } = await admin.supabase
    .from("tasks")
    .select("*")
    .eq("student_id", id)
    .order("created_at", { ascending: false });
  const tasks = (data ?? []) as Task[];
  const unseen = new Set(tasks.filter((t) => t.status === "done" && !t.seen_by_admin).map((t) => t.id));

  // Opening the page counts as seeing the newly completed tasks.
  if (unseen.size) await admin.supabase.from("tasks").update({ seen_by_admin: true }).in("id", [...unseen]);

  const open = tasks.filter((t) => t.status === "open");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <>
      <Link href="/admin/students" className="admin-link">
        → כל התלמידים
      </Link>
      <h1>{student.name}</h1>
      <p className="admin-hint">
        כניסה: <span dir="ltr">{student.login_email}</span> · <span dir="ltr">michalronies.co.il/student</span>
      </p>

      <section className="admin-item">
        <h2>משימה חדשה</h2>
        <form action={addTask} className="item-form stacked">
          <input type="hidden" name="student_id" value={student.id} />
          <label>
            כותרת
            <input name="title" type="text" required maxLength={200} placeholder="למשל: הבנת הנקרא – קטע 3" />
          </label>
          <label>
            הסבר / הוראות
            <textarea name="instructions" rows={4} maxLength={6000} />
          </label>
          <label>
            תאריך הגשה (לא חובה)
            <input name="due_date" type="date" />
          </label>
          <label className="check">
            <input type="checkbox" name="answer_requested" />
            התלמיד/ה צריך/ה לכתוב תשובה באתר
          </label>
          <button type="submit" className="admin-btn primary">
            הוספת המשימה
          </button>
        </form>
      </section>

      <h2 style={{ marginTop: 28 }}>משימות פתוחות ({open.length})</h2>
      <div className="admin-list">
        {open.length === 0 && <p className="admin-empty">אין משימות פתוחות.</p>}
        {open.map((t) => (
          <TaskCard key={t.id} task={t} isNew={false} />
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>משימות שבוצעו ({done.length})</h2>
      <div className="admin-list">
        {done.length === 0 && <p className="admin-empty">עוד לא בוצעו משימות.</p>}
        {done.map((t) => (
          <TaskCard key={t.id} task={t} isNew={unseen.has(t.id)} />
        ))}
      </div>

      <section className="admin-item" style={{ marginTop: 32 }}>
        <h2>הגדרות התלמיד</h2>
        <ResetPasswordForm studentId={student.id} />
        <form action={deleteStudent} className="item-delete">
          <input type="hidden" name="id" value={student.id} />
          <ConfirmButton message={`למחוק את ${student.name} ואת כל המשימות שלו/ה?`}>מחיקת התלמיד</ConfirmButton>
        </form>
      </section>
    </>
  );
}

function TaskCard({ task, isNew }: { task: Task; isNew: boolean }) {
  return (
    <article className={`admin-item ${isNew ? "status-new" : ""}`}>
      <div className="item-top">
        <h2>{task.title}</h2>
        {isNew && <span className="pill pill-new">חדש!</span>}
        {task.status === "done" ? (
          <span className="pill pill-closed">✅ בוצע {task.done_at ? dateTime.format(new Date(task.done_at)) : ""}</span>
        ) : (
          task.due_date && <span className="pill pill-contacted">להגשה עד {dateOnly(task.due_date)}</span>
        )}
      </div>
      {task.instructions && <p className="item-message">{task.instructions}</p>}
      {task.status === "done" && (
        <>
          <p className="task-answer-label">התשובה של התלמיד/ה:</p>
          <p className="item-message">{task.answer || "(סימן/ה שבוצע, בלי תשובה כתובה)"}</p>
          <form action={saveFeedback} className="item-form">
            <input type="hidden" name="id" value={task.id} />
            <label className="grow">
              משוב לתלמיד/ה (יופיע אצלו/ה)
              <textarea name="feedback" defaultValue={task.feedback ?? ""} rows={2} />
            </label>
            <button type="submit" className="admin-btn primary">
              שמירת משוב
            </button>
          </form>
          <form action={reopenTask} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={task.id} />
            <button type="submit" className="admin-btn ghost">
              להחזיר למשימות הפתוחות
            </button>
          </form>
        </>
      )}
      <form action={deleteTask} className="item-delete">
        <input type="hidden" name="id" value={task.id} />
        <ConfirmButton message="למחוק את המשימה?">מחיקה</ConfirmButton>
      </form>
    </article>
  );
}
