"use client";

import { useState } from "react";

/**
 * Two-step delete: the first click asks, the second one submits. Done in the
 * page itself because some browsers (and embedded views) block confirm().
 */
export default function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" className="admin-btn danger" onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  }
  return (
    <span className="confirm-row">
      <span>{message}</span>
      <button type="submit" className="admin-btn danger solid">
        כן, למחוק
      </button>
      <button type="button" className="admin-btn ghost" onClick={() => setAsking(false)}>
        ביטול
      </button>
    </span>
  );
}
