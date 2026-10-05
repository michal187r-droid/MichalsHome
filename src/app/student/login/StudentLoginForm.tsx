"use client";

import { useActionState } from "react";
import { studentSignIn } from "../actions";

export default function StudentLoginForm() {
  const [state, action, pending] = useActionState(studentSignIn, null);
  return (
    <form action={action} className="admin-form">
      <label>
        אימייל
        <input name="email" type="email" required autoComplete="username" dir="ltr" />
      </label>
      <label>
        סיסמה
        <input name="password" type="password" required autoComplete="current-password" dir="ltr" />
      </label>
      {state?.message && <p className="admin-error" role="alert">{state.message}</p>}
      <button type="submit" className="admin-btn primary" disabled={pending}>
        {pending ? "נכנס…" : "כניסה"}
      </button>
    </form>
  );
}
