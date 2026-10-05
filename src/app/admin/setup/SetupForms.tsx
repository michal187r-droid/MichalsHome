"use client";

import { useActionState, useState, useTransition } from "react";
import { runMigration, setAdminPassword, type SetupState } from "./actions";

export default function SetupForms() {
  const [dbState, setDbState] = useState<SetupState>(null);
  const [dbPending, startDb] = useTransition();
  const [pwState, pwAction, pwPending] = useActionState(setAdminPassword, null);

  return (
    <div className="admin-form">
      <section className="setup-step">
        <h2>1. הכנת מסד הנתונים</h2>
        <button
          type="button"
          className="admin-btn primary"
          disabled={dbPending}
          onClick={() => startDb(async () => setDbState(await runMigration()))}
        >
          {dbPending ? "מכין…" : "הכנת מסד הנתונים"}
        </button>
        {dbState && <p className={dbState.ok ? "admin-ok" : "admin-error"}>{dbState.message}</p>}
      </section>

      <section className="setup-step">
        <h2>2. בחירת סיסמה לעמוד הניהול</h2>
        <p className="admin-hint">
          הכניסה תהיה עם המייל <span dir="ltr">michal187r@gmail.com</span> והסיסמה שתבחרי כאן (10 תווים לפחות).
        </p>
        <form action={pwAction} className="admin-form">
          <label>
            סיסמה חדשה
            <input name="password" type="password" required minLength={10} autoComplete="new-password" dir="ltr" />
          </label>
          <label>
            שוב, לאימות
            <input name="confirm" type="password" required minLength={10} autoComplete="new-password" dir="ltr" />
          </label>
          <button type="submit" className="admin-btn primary" disabled={pwPending}>
            {pwPending ? "שומרת…" : "שמירת הסיסמה"}
          </button>
          {pwState && <p className={pwState.ok ? "admin-ok" : "admin-error"}>{pwState.message}</p>}
        </form>
        {pwState?.ok && (
          <a href="/admin/login" className="admin-btn ghost">
            לעמוד הכניסה ←
          </a>
        )}
      </section>
    </div>
  );
}
