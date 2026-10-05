"use client";

/** Submit button that asks before doing something that can't be undone. */
export default function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="admin-btn danger"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
