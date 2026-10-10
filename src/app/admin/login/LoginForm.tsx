"use client";

import { useActionState, useState } from "react";
import { requestPasswordReset, signIn } from "../actions";

export default function LoginForm() {
  const [forgot, setForgot] = useState(false);
  return forgot ? <ForgotForm onBack={() => setForgot(false)} /> : <SignInForm onForgot={() => setForgot(true)} />;
}

function SignInForm({ onForgot }: { onForgot: () => void }) {
  const [state, formAction, pending] = useActionState(signIn, null);
  return (
    <form action={formAction} className="admin-form">
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
        {pending ? "נכנסת…" : "כניסה"}
      </button>
      <button type="button" className="admin-btn ghost" onClick={onForgot}>
        שכחתי סיסמה
      </button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);
  return (
    <form action={formAction} className="admin-form">
      <p>נשלח אלייך מייל עם קישור לבחירת סיסמה חדשה.</p>
      <label>
        אימייל
        <input name="email" type="email" required autoComplete="username" dir="ltr" />
      </label>
      {state?.message && (
        <p className={state.ok ? "admin-ok" : "admin-error"} role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className="admin-btn primary" disabled={pending}>
        {pending ? "שולחת…" : "שליחת קישור"}
      </button>
      <button type="button" className="admin-btn ghost" onClick={onBack}>
        חזרה לכניסה
      </button>
    </form>
  );
}
