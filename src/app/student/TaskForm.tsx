"use client";

import { useActionState } from "react";
import { completeTask } from "./actions";

export default function TaskForm({ id, answerRequested }: { id: string; answerRequested: boolean }) {
  const [state, action, pending] = useActionState(completeTask, null);
  if (state?.ok) return <p className="admin-ok">{state.message}</p>;

  return (
    <form action={action} className="item-form stacked">
      <input type="hidden" name="id" value={id} />
      {answerRequested && (
        <label>
          התשובה שלי
          <textarea name="answer" rows={5} required maxLength={10000} />
        </label>
      )}
      {state?.message && <p className="admin-error">{state.message}</p>}
      <button type="submit" className="admin-btn primary" disabled={pending}>
        {pending ? "שומר…" : "סיימתי ✅"}
      </button>
    </form>
  );
}
