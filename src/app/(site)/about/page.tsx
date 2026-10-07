import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import Image from "next/image";
import michalPhoto from "@/../public/michal.webp";

export const metadata: Metadata = { title: "אודותיי" };

export default async function AboutPage() {
  const { about } = await getContent();
  return (
    <div className="section">
      <div className="wrap about-grid">
        <div>
          <div className="about-photo">
            <Image src={michalPhoto} alt="מיכל רוניס בקליניקה" priority sizes="(max-width: 820px) 100vw, 420px" />
          </div>
          <div className="info-card credentials">
            <h2>השכלה והסמכות</h2>
            <ul className="value-list">
              {about.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <span className="eyebrow-home">אודות · מיכל רוניס</span>
          <h1 className="about-headline">{about.headline}</h1>
          <p className="hero-tagline">{about.lead}</p>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="value-list">
            {about.values.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-primary">
              קביעת שיחת היכרות
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
