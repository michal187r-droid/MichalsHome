import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { QUESTIONS_TAG, publicClient } from "@/lib/supabase/public";
import QuestionForm from "@/components/QuestionForm";

export const metadata: Metadata = {
  title: "שאלות ותשובות",
  description: "שאלות של הורים על למידה, הפרעות קשב והוראה מותאמת – ותשובות של מיכל רוניס.",
};

type PublishedQuestion = { id: string; topic: string | null; question: string; answer: string };

async function getPublished(): Promise<PublishedQuestion[]> {
  const supabase = publicClient(QUESTIONS_TAG);
  if (!supabase) return [];
  const { data } = await supabase
    .from("published_questions")
    .select("id, topic, question, answer")
    .order("answered_at", { ascending: false });
  return data ?? [];
}

export default async function QuestionsPage() {
  const [{ categories }, questions] = await Promise.all([getContent(), getPublished()]);
  const topics = categories.map((c) => c.title);

  // Group answered questions by topic, in the order of the services.
  const groups = [...topics, "כללי"]
    .map((topic) => ({ topic, items: questions.filter((q) => (q.topic || "כללי") === topic) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">שאלות ותשובות</span>
          <h1>יש לכם שאלה? שאלו אותי</h1>
          <p>
            כאן מתפרסמות שאלות של הורים ותשובות שלי – על למידה, הפרעות קשב, בגרויות והתמודדות בבית. אפשר לשאול כל
            שאלה, גם בעילום שם.
          </p>
        </div>
        <div className="qa-grid">
          <div>
            {groups.length === 0 ? (
              <p className="blog-note" style={{ marginTop: 0 }}>
                עוד אין כאן תשובות שפורסמו – אפשר להיות הראשונים לשאול.
              </p>
            ) : (
              groups.map((g) => (
                <section key={g.topic} className="qa-group">
                  <h2>{g.topic}</h2>
                  {g.items.map((q, i) => (
                    <details key={q.id} className="faq-item" open={i === 0}>
                      <summary>{q.question}</summary>
                      <p className="qa-answer">{q.answer}</p>
                    </details>
                  ))}
                </section>
              ))
            )}
          </div>
          <aside>
            <QuestionForm topics={topics} />
          </aside>
        </div>
      </div>
    </div>
  );
}
