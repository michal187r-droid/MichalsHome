import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { addTask, deleteStudent, deleteTask, moveTask, reopenTask, saveFeedback, updateDatabase } from "../../../actions";
import { byFolder, GENERAL_FOLDER } from "@/lib/folders";
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
  subject?: string | null;
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
  const folders = [...new Set(tasks.map((t) => t.subject?.trim()).filter((f): f is string => !!f))];
  const listId = `folders-${student.id}`;

  // Folders need a database column added by "update database" after this site update.
  const { error: noFolders } = await admin.supabase.from("tasks").select("subject").limit(1);

  return (
    <>
      <Link href="/admin/students" className="admin-link">
        → כל התלמידים
      </Link>
      <h1>{student.name}</h1>
      <p className="admin-hint">
        כניסה: <span dir="ltr">{student.login_email}</span> · <span dir="ltr">michalronies.co.il/student</span>
      </p>

      <datalist id={listId}>
        {folders.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      {noFolders && (
        <section className="admin-item status-new">
          <h2>📁 תיקיות למקצועות</h2>
          <p>כדי לסדר משימות בתיקיות לפי מקצוע, צריך לעדכן פעם אחת את מסד הנתונים.</p>
          <form action={updateDatabase}>
            <button type="submit" className="admin-btn primary">
              עדכון מסד הנתונים
            </button>
          </form>
        </section>
      )}

      <section className="admin-item">
        <h2>משימה חדשה</h2>
        <form action={addTask} className="item-form stacked">
          <input type="hidden" name="student_id" value={student.id} />
          {!noFolders && (
            <label>
              תיקייה / מקצוע
              <input name="subject" type="text" list={listId} maxLength={60} placeholder="למשל: ספרות. אפשר לבחור קיימת או לכתוב חדשה" />
            </label>
          )}
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
        {byFolder(open).map(([folder, items]) => (
          <FolderGroup key={folder} name={folder} show={!noFolders}>
            {items.map((t) => (
              <TaskCard key={t.id} task={t} isNew={false} listId={noFolders ? undefined : listId} />
            ))}
          </FolderGroup>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>משימות שבוצעו ({done.length})</h2>
      <div className="admin-list">
        {done.length === 0 && <p className="admin-empty">עוד לא בוצעו משימות.</p>}
        {byFolder(done).map(([folder, items]) => (
          <FolderGroup key={folder} name={folder} show={!noFolders}>
            {items.map((t) => (
              <TaskCard key={t.id} task={t} isNew={unseen.has(t.id)} listId={noFolders ? undefined : listId} />
            ))}
          </FolderGroup>
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

function FolderGroup({ name, show, children }: { name: string; show: boolean; children: ReactNode }) {
  if (!show) return <>{children}</>;
  return (
    <>
      <h3 className="folder-title">📁 {name}</h3>
      {children}
    </>
  );
}

function TaskCard({ task, isNew, listId }: { task: Task; isNew: boolean; listId?: string }) {
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
      {listId && (
        <details className="task-move">
          <summary>העברה לתיקייה אחרת</summary>
          <form action={moveTask} className="item-form">
            <input type="hidden" name="id" value={task.id} />
            <label className="grow">
              תיקייה (ריק = {GENERAL_FOLDER})
              <input name="subject" type="text" list={listId} maxLength={60} defaultValue={task.subject ?? ""} />
            </label>
            <button type="submit" className="admin-btn ghost">
              העברה
            </button>
          </form>
        </details>
      )}
      <form action={deleteTask} className="item-delete">
        <input type="hidden" name="id" value={task.id} />
        <ConfirmButton message="למחוק את המשימה?">מחיקה</ConfirmButton>
      </form>
    </article>
  );
}
