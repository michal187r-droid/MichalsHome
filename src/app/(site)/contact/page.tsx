import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { whatsappHref } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "צור קשר" };

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;
  const { categories, contact } = await getContent();
  const initialService = categories.find((c) => c.slug === service)?.title ?? "";
  const serviceOptions = categories.map((c) => c.title);

  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">צור קשר</span>
          <h1>נשמח לשמוע מה מעסיק אתכם</h1>
          <p>מלאו את הפרטים ונחזור אליכם בהקדם, או צרו קשר ישירות בטלפון או בוואטסאפ.</p>
        </div>
        <div className="contact-grid">
          <ContactForm services={serviceOptions} initialService={initialService} whatsapp={contact.whatsapp} />
          <div className="contact-info-card">
            <div className="contact-row">
              <span className="ic">📞</span>
              <div>
                <div>טלפון</div>
                <a href={`tel:${contact.phone.replace(/\D/g, "")}`}>{contact.phone}</a>
              </div>
            </div>
            <div className="contact-row">
              <span className="ic">💬</span>
              <div>
                <div>וואטסאפ</div>
                <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener">
                  {contact.phone}
                </a>
              </div>
            </div>
            <div className="contact-row">
              <span className="ic">✉️</span>
              <div>
                <div>אימייל</div>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            <div className="contact-row">
              <span className="ic">📍</span>
              <div>
                <div>אזור פעילות</div>
                <div className="val">{contact.area}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
