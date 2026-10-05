"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/(site)/actions";
import { whatsappHref } from "@/lib/whatsapp";

type Props = { services: string[]; initialService: string; whatsapp: string };

export default function ContactForm({ services, initialService, whatsapp }: Props) {
  const [state, formAction, pending] = useActionState(submitLead, null);

  // Same details, sent as a ready-made WhatsApp message instead.
  function sendWhatsApp(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form!;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const field = (k: string) => String(data.get(k) || "").trim();
    const lines = [
      "שלום מיכל, פנייה מהאתר:",
      `שם: ${field("name")}`,
      `טלפון: ${field("phone")}`,
      field("email") && `אימייל: ${field("email")}`,
      field("service") && `שירות: ${field("service")}`,
      field("message") && `הודעה: ${field("message")}`,
    ].filter(Boolean);
    window.open(whatsappHref(whatsapp, lines.join("\n")), "_blank", "noopener");
  }

  if (state?.ok) {
    return (
      <div className="contact-form form-success" role="status">
        <h2>תודה, הפנייה התקבלה! 💛</h2>
        <p>אחזור אליכם בהקדם. אם זה דחוף, אפשר גם לכתוב לי בוואטסאפ.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction}>
      <div className="field">
        <label htmlFor="cf-name">שם מלא</label>
        <input id="cf-name" name="name" type="text" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="cf-phone">טלפון</label>
        <input id="cf-phone" name="phone" type="tel" required maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">אימייל</label>
        <input id="cf-email" name="email" type="email" maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="cf-service">באיזה שירות מעוניינים?</label>
        <select id="cf-service" name="service" defaultValue={initialService}>
          <option value="">בחרו קטגוריה</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="אחר">אחר</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">הודעה</label>
        <textarea id="cf-msg" name="message" maxLength={4000} placeholder="ספרו לי קצת על הצורך..."></textarea>
      </div>
      {/* Hidden from people; bots fill it in. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "שולח…" : "שליחת פנייה"}
        </button>
        <button type="button" className="btn btn-wa" onClick={sendWhatsApp}>
          או שליחה בוואטסאפ
        </button>
      </div>
      <p className="form-note">הפרטים מגיעים רק אליי, ומשמשים רק כדי לחזור אליכם.</p>
    </form>
  );
}
