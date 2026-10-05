"use client";

import { useActionState } from "react";
import { createStudent } from "../../actions";

export default function AddStudentForm() {
  const [state, action, pending] = useActionState(createStudent, null);
  return (
    <form action={action} className="item-form stacked" key={state?.ok ? state.message : "form"}>
      <label>
        שם התלמיד/ה
        <input name="name" type="text" required maxLength={80} />
      </label>
      <label>
        מייל לכניסה (של התלמיד או של ההורה)
        <input name="email" type="email" required dir="ltr" />
      </label>
      <label>
        סיסמה (8 תווים לפחות – תמסרי אותה לתלמיד/ה)
        <input name="password" type="text" required minLength={8} dir="ltr" autoComplete="off" />
      </label>
      {state?.message && <p className={state.ok ? "admin-ok" : "admin-error"}>{state.message}</p>}
      <button type="submit" className="admin-btn primary" disabled={pending}>
        {pending ? "מוסיפה…" : "הוספה"}
      </button>
    </form>
  );
}
