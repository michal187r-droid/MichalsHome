import Image from "next/image";
import Link from "next/link";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

type Service = { slug: string; title: string };

export default function Footer({ services, whatsapp }: { services: Service[]; whatsapp: string }) {
  return (
    <>
      <svg className="wave-divider-footer" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 Q 150 60 300 30 T 600 30 T 900 30 T 1200 30 V0 H0 Z" fill="var(--color-teal-deep)" />
      </svg>
      <footer className="site-footer">
        <div className="wrap">
          <div>
            <Image src="/logo-nav.png" alt="הבית של מיכל" width={480} height={350} style={{ width: "auto" }} />
            <p>למידה אישית במקצועות רבי‐מלל, הוראה מותאמת שפתית-רגשית לילדים ובני נוער.</p>
          </div>
          <div>
            <h4>השירותים שלנו</h4>
            <ul>
              {services.map((c) => (
                <li key={c.slug}>
                  <Link href={`/services/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>ניווט</h4>
            <ul>
              <li><Link href="/about">אודות מיכל</Link></li>
              <li><Link href="/testimonials">המלצות</Link></li>
              <li><Link href="/questions">שאלות ותשובות</Link></li>
              <li><Link href="/contact">צור קשר</Link></li>
            </ul>
          </div>
        </div>
        <p className="footer-bottom">© הבית של מיכל · כל הזכויות שמורות</p>
      </footer>
      <a
        className="wa-float"
        href={whatsappHref(whatsapp, "שלום מיכל, הגעתי מהאתר ואשמח לפרטים.")}
        target="_blank"
        rel="noopener"
        aria-label="שליחת הודעה בוואטסאפ"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
