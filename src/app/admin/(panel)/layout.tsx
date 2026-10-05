import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "../actions";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  if (!supabaseConfigured) redirect("/admin/login");
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const [{ count: newLeads }, { count: openQuestions }, { count: doneTasks }] = await Promise.all([
    admin.supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.supabase.from("questions").select("id", { count: "exact", head: true }).is("answer", null),
    admin.supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "done").eq("seen_by_admin", false),
  ]);

  return (
    <>
      <header className="admin-bar">
        <Link href="/admin" className="admin-brand">
          ניהול · הבית של מיכל
        </Link>
        <nav>
          <Link href="/admin/leads">
            פניות {newLeads ? <span className="badge">{newLeads}</span> : null}
          </Link>
          <Link href="/admin/questions">
            שאלות {openQuestions ? <span className="badge">{openQuestions}</span> : null}
          </Link>
          <Link href="/admin/students">
            תלמידים {doneTasks ? <span className="badge">{doneTasks}</span> : null}
          </Link>
          <Link href="/admin/content">עריכת האתר</Link>
          <a href="/" target="_blank" rel="noopener">
            לאתר ↗
          </a>
        </nav>
        <form action={signOut}>
          <button type="submit" className="admin-btn ghost">
            יציאה
          </button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </>
  );
}
