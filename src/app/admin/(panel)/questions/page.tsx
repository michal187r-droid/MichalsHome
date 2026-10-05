import { getAdmin } from "@/lib/supabase/server";
import { getContent } from "@/lib/content";
import { deleteQuestion, saveAnswer } from "../../actions";
import ConfirmButton from "../../ConfirmButton";

type Question = {
  id: string;
  created_at: string;
  topic: string | null;
  question: string;
  asker_name: string | null;
  asker_contact: string | null;
  answer: string | null;
  published: boolean;
};

const dateFormat = new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeZone: "Asia/Jerusalem" });

export default async function QuestionsAdminPage() {
  const admin = (await getAdmin())!;
  const [{ data }, { categories }] = await Promise.all([
    admin.supabase.from("questions").select("*").order("created_at", { ascending: false }),
    getContent(),
  ]);
  const questions = (data ?? []) as Question[];
  const topics = categories.map((c) => c.title);
  // Unanswered questions first.
  const sorted = [...questions.filter((q) => !q.answer), ...questions.filter((q) => q.answer)];

  return (
    <>
      <div className="admin-head">
        <h1>שאלות ותשובות</h1>
        <a href="/questions" target="_blank" rel="noopener" className="admin-link">
          לעמוד השאלות באתר ↗
        </a>
      </div>
      <p className="admin-hint">
        כשמסמנים &quot;לפרסם באתר&quot;, השאלה והתשובה מופיעות בעמוד השאלות – <strong>בלי השם ובלי פרטי הקשר</strong>.
        אפשר לנסח מחדש את השאלה לפני הפרסום, למשל כדי להוריד פרטים מזהים.
      </p>
      {sorted.length === 0 && <p className="admin-empty">עוד לא נשאלו שאלות.</p>}
      <div className="admin-list">
        {sorted.map((q) => (
          <article key={q.id} className={`admin-item ${q.answer ? "" : "status-new"}`}>
            <div className="item-top">
              <h2>{q.asker_name || "ללא שם"}</h2>
              <span className={`pill ${q.published ? "pill-closed" : q.answer ? "pill-contacted" : "pill-new"}`}>
                {q.published ? "מפורסם" : q.answer ? "נענה, לא מפורסם" : "מחכה לתשובה"}
              </span>
              <time>{dateFormat.format(new Date(q.created_at))}</time>
            </div>
            {q.asker_contact && (
              <p className="item-contact">
                ליצירת קשר: <span dir="ltr">{q.asker_contact}</span>
              </p>
            )}
            <form action={saveAnswer} className="item-form stacked">
              <input type="hidden" name="id" value={q.id} />
              <label>
                השאלה (כפי שתופיע באתר)
                <textarea name="question" defaultValue={q.question} rows={2} />
              </label>
              <label>
                נושא
                <select name="topic" defaultValue={q.topic ?? ""}>
                  <option value="">כללי</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                התשובה שלי
                <textarea name="answer" defaultValue={q.answer ?? ""} rows={4} />
              </label>
              <label className="check">
                <input type="checkbox" name="published" defaultChecked={q.published} />
                לפרסם באתר (בלי שם ופרטים)
              </label>
              <button type="submit" className="admin-btn primary">
                שמירה
              </button>
            </form>
            <form action={deleteQuestion} className="item-delete">
              <input type="hidden" name="id" value={q.id} />
              <ConfirmButton message="למחוק את השאלה? אי אפשר לשחזר.">מחיקה</ConfirmButton>
            </form>
          </article>
        ))}
      </div>
    </>
  );
}
