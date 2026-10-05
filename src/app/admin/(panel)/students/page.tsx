import Link from "next/link";
import { getAdmin } from "@/lib/supabase/server";
import AddStudentForm from "./AddStudentForm";

type Row = { id: string; name: string; login_email: string; tasks: { status: string; seen_by_admin: boolean }[] };

export default async function StudentsPage() {
  const admin = (await getAdmin())!;
  const { data } = await admin.supabase
    .from("students")
    .select("id, name, login_email, tasks(status, seen_by_admin)")
    .order("name");
  const students = (data ?? []) as Row[];

  return (
    <>
      <h1>תלמידים</h1>
      <p className="admin-hint">
        כל תלמיד נכנס ב-<span dir="ltr">michalronies.co.il/student</span> עם המייל והסיסמה שתבחרי כאן, ורואה רק את המשימות
        שלו.
      </p>
      {students.length === 0 && <p className="admin-empty">עוד אין תלמידים. אפשר להוסיף למטה.</p>}
      <div className="admin-list">
        {students.map((s) => {
          const open = s.tasks.filter((t) => t.status === "open").length;
          const newlyDone = s.tasks.filter((t) => t.status === "done" && !t.seen_by_admin).length;
          return (
            <Link key={s.id} href={`/admin/students/${s.id}`} className={`admin-item admin-row-link ${newlyDone ? "status-new" : ""}`}>
              <div className="item-top">
                <h2>{s.name}</h2>
                {newlyDone > 0 && <span className="pill pill-new">✅ {newlyDone} משימות חדשות שבוצעו</span>}
                <span className="pill pill-contacted">{open} פתוחות</span>
              </div>
              <p dir="ltr" style={{ textAlign: "end" }}>{s.login_email}</p>
            </Link>
          );
        })}
      </div>
      <section className="admin-item" style={{ marginTop: 24 }}>
        <h2>הוספת תלמיד</h2>
        <AddStudentForm />
      </section>
    </>
  );
}
