"use client";

import { useActionState } from "react";
import { resetStudentPassword } from "../../../actions";

export default function ResetPasswordForm({ studentId }: { studentId: string }) {
  const [state, action, pending] = useActionState(resetStudentPassword, null);
  return (
    <form action={action} className="item-form">
      <input type="hidden" name="id" value={studentId} />
      <label className="grow">
        סיסמה חדשה לתלמיד/ה (אם שכח/ה)
        <input name="password" type="text" minLength={8} required dir="ltr" autoComplete="off" />
      </label>
      <button type="submit" className="admin-btn ghost" disabled={pending}>
        עדכון סיסמה
      </button>
      {state?.message && <p className={state.ok ? "admin-ok" : "admin-error"}>{state.message}</p>}
    </form>
  );
}
