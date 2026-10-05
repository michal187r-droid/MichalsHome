import { getAdmin } from "@/lib/supabase/server";
import { whatsappHref } from "@/lib/whatsapp";
import { deleteLead, updateLead } from "../../actions";
import ConfirmButton from "../../ConfirmButton";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  notes: string | null;
};

const STATUS_LABELS: Record<Lead["status"], string> = { new: "חדש", contacted: "חזרתי אליו", closed: "נסגר" };

const dateFormat = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});

// Israeli mobile "05x..." → international "9725x..." for WhatsApp links.
const toInternational = (phone: string) => phone.replace(/\D/g, "").replace(/^0/, "972");

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const { show } = await searchParams;
  const admin = (await getAdmin())!;
  let query = admin.supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (show !== "all") query = query.neq("status", "closed");
  const { data } = await query;
  const leads = (data ?? []) as Lead[];

  return (
    <>
      <div className="admin-head">
        <h1>פניות מהאתר</h1>
        <a href={show === "all" ? "/admin/leads" : "/admin/leads?show=all"} className="admin-link">
          {show === "all" ? "להסתיר פניות שנסגרו" : "להציג גם פניות שנסגרו"}
        </a>
      </div>
      {leads.length === 0 && <p className="admin-empty">אין פניות כרגע.</p>}
      <div className="admin-list">
        {leads.map((lead) => (
          <article key={lead.id} className={`admin-item status-${lead.status}`}>
            <div className="item-top">
              <h2>{lead.name}</h2>
              <span className={`pill pill-${lead.status}`}>{STATUS_LABELS[lead.status]}</span>
              <time>{dateFormat.format(new Date(lead.created_at))}</time>
            </div>
            <dl className="item-details">
              <dt>טלפון</dt>
              <dd dir="ltr">{lead.phone}</dd>
              {lead.email && (
                <>
                  <dt>מייל</dt>
                  <dd dir="ltr">{lead.email}</dd>
                </>
              )}
              {lead.service && (
                <>
                  <dt>שירות</dt>
                  <dd>{lead.service}</dd>
                </>
              )}
            </dl>
            {lead.message && <p className="item-message">{lead.message}</p>}
            <div className="item-actions">
              <a className="admin-btn wa" href={whatsappHref(toInternational(lead.phone), `שלום ${lead.name}, כאן מיכל מ"הבית של מיכל". קיבלתי את הפנייה שלך 😊`)} target="_blank" rel="noopener">
                וואטסאפ
              </a>
              <a className="admin-btn ghost" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                חיוג
              </a>
            </div>
            <form action={updateLead} className="item-form">
              <input type="hidden" name="id" value={lead.id} />
              <label>
                סטטוס
                <select name="status" defaultValue={lead.status}>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grow">
                הערות שלי
                <textarea name="notes" defaultValue={lead.notes ?? ""} rows={2} />
              </label>
              <button type="submit" className="admin-btn primary">
                שמירה
              </button>
            </form>
            <form action={deleteLead} className="item-delete">
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmButton message={`למחוק את הפנייה של ${lead.name}? אי אפשר לשחזר.`}>מחיקה</ConfirmButton>
            </form>
          </article>
        ))}
      </div>
    </>
  );
}
