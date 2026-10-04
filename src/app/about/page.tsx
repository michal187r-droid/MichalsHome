import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/site";
import Image from "next/image";
import michalPhoto from "../../../public/michal.webp";

export const metadata: Metadata = { title: "אודות מיכל" };

export default function AboutPage() {
  return (
    <div className="section">
      <div className="wrap about-grid">
        <div className="about-photo">
          <Image src={michalPhoto} alt="מיכל רוניס בקליניקה" priority sizes="(max-width: 820px) 100vw, 420px" />
        </div>
        <div>
          <span className="eyebrow-home">אודות · מיכל רוניס</span>
          <h1 className="about-headline">{about.headline}</h1>
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
