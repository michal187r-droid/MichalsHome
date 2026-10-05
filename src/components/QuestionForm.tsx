"use client";

import { useActionState } from "react";
import { submitQuestion } from "@/app/(site)/actions";

export default function QuestionForm({ topics }: { topics: string[] }) {
  const [state, formAction, pending] = useActionState(submitQuestion, null);

  if (state?.ok) {
    return (
      <div className="contact-form form-success" role="status">
        <h2>תודה על השאלה! 💛</h2>
        <p>אענה בהקדם. תשובות שיכולות לעזור גם להורים אחרים יתפרסמו כאן – בלי שמות ובלי פרטים מזהים.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction}>
      <div className="field">
        <label htmlFor="q-text">השאלה שלכם</label>
        <textarea id="q-text" name="question" required minLength={5} maxLength={2000} placeholder="למשל: איך יודעים אם הילד צריך ליווי?"></textarea>
      </div>
      <div className="field">
        <label htmlFor="q-topic">נושא</label>
        <select id="q-topic" name="topic" defaultValue="">
          <option value="">כללי</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="q-name">שם (לא חובה)</label>
        <input id="q-name" name="name" type="text" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="q-contact">טלפון או מייל, אם תרצו תשובה אישית (לא חובה)</label>
        <input id="q-contact" name="contact" type="text" maxLength={200} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "שולח…" : "שליחת שאלה"}
        </button>
      </div>
      <p className="form-note">השם ופרטי הקשר לא יתפרסמו אף פעם. הם מגיעים רק אליי.</p>
    </form>
  );
}
