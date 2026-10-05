import Link from "next/link";
import { getAdmin } from "@/lib/supabase/server";

export default async function AdminHome() {
  const admin = (await getAdmin())!;
  const [{ count: newLeads }, { count: openQuestions }] = await Promise.all([
    admin.supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.supabase.from("questions").select("id", { count: "exact", head: true }).is("answer", null),
  ]);

  return (
    <>
      <h1>שלום מיכל 👋</h1>
      <div className="admin-tiles">
        <Link href="/admin/leads" className="admin-tile">
          <span className="tile-num">{newLeads ?? 0}</span>
          <span>פניות חדשות</span>
        </Link>
        <Link href="/admin/questions" className="admin-tile">
          <span className="tile-num">{openQuestions ?? 0}</span>
          <span>שאלות שמחכות לתשובה</span>
        </Link>
        <Link href="/admin/content" className="admin-tile">
          <span className="tile-num">✏️</span>
          <span>עריכת הטקסטים באתר</span>
        </Link>
      </div>
    </>
  );
}
