import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/site";
import { BookArt } from "@/components/icons";

export const metadata: Metadata = { title: "אודות מיכל" };

export default function AboutPage() {
  return (
    <div className="section">
      <div className="wrap about-grid">
        <div className="about-photo">
          <BookArt />
        </div>
        <div>
          <span className="eyebrow-home">אודות</span>
          <h1>מיכל</h1>
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
