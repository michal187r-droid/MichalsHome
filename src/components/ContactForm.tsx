"use client";

import { contact, whatsappHref } from "@/content/site";

type Option = { value: string; label: string };

// Until the site has a backend (stage 2), the form hands the message to
// WhatsApp or the visitor's email app, pre-filled with what they typed.
export default function ContactForm({ services, initialService }: { services: Option[]; initialService: string }) {
  function buildMessage(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const serviceValue = String(data.get("service") || "");
    const service = services.find((s) => s.value === serviceValue)?.label || (serviceValue === "other" ? "אחר" : "");
    const message = String(data.get("message") || "").trim();

    const lines = [
      "שלום מיכל, פנייה מהאתר:",
      `שם: ${name}`,
      `טלפון: ${phone}`,
      email && `אימייל: ${email}`,
      service && `שירות: ${service}`,
      message && `הודעה: ${message}`,
    ].filter(Boolean);
    return { name, text: lines.join("\n") };
  }

  function send(e: React.MouseEvent<HTMLButtonElement>, via: "whatsapp" | "email") {
    const form = e.currentTarget.form!;
    if (!form.reportValidity()) return;
    const { name, text } = buildMessage(form);
    if (via === "whatsapp") {
      window.open(whatsappHref(text), "_blank", "noopener");
    } else {
      const subject = encodeURIComponent(`פנייה מהאתר – ${name}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
    }
  }

  return (
    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="cf-name">שם מלא</label>
        <input id="cf-name" name="name" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="cf-phone">טלפון</label>
        <input id="cf-phone" name="phone" type="tel" required />
      </div>
      <div className="field">
        <label htmlFor="cf-email">אימייל</label>
        <input id="cf-email" name="email" type="email" />
      </div>
      <div className="field">
        <label htmlFor="cf-service">באיזה שירות מעוניינים?</label>
        <select id="cf-service" name="service" defaultValue={initialService}>
          <option value="">בחרו קטגוריה</option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
          <option value="other">אחר</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">הודעה</label>
        <textarea id="cf-msg" name="message" placeholder="ספרו לנו קצת על הצורך..."></textarea>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-wa" onClick={(e) => send(e, "whatsapp")}>
          שליחה בוואטסאפ
        </button>
        <button type="button" className="btn btn-primary" onClick={(e) => send(e, "email")}>
          שליחה במייל
        </button>
      </div>
      <p className="form-note">הפרטים שמילאתם יועברו להודעה מוכנה בוואטסאפ או במייל – רק ללחוץ שליחה.</p>
    </form>
  );
}
