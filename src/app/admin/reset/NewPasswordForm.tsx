"use client";

import { useActionState } from "react";
import { setNewPassword } from "../actions";

export default function NewPasswordForm() {
  const [state, formAction, pending] = useActionState(setNewPassword, null);
  return (
    <form action={formAction} className="admin-form">
      <label>
        סיסמה חדשה (10 תווים לפחות)
        <input name="password" type="password" required minLength={10} autoComplete="new-password" dir="ltr" />
      </label>
      <label>
        שוב, לאישור
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" dir="ltr" />
      </label>
      {state?.message && <p className="admin-error" role="alert">{state.message}</p>}
      <button type="submit" className="admin-btn primary" disabled={pending}>
        {pending ? "שומרת…" : "שמירה וכניסה"}
      </button>
    </form>
  );
}
