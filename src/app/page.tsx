import Image from "next/image";
import Link from "next/link";
import { about, categories, hero, testimonials } from "@/content/site";
import { CategoryIcon } from "@/components/icons";
import Testimonials from "@/components/Testimonials";
import michalPhoto from "../../public/michal.webp";

export default function Home() {
  return (
    <>
      <div className="hero">
        <svg className="roofline" viewBox="0 0 400 300" fill="none" aria-hidden="true">
          <path d="M20 180 L200 40 L380 180" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M90 180 L90 280 L310 280 L310 180" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        </svg>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="hero-meta">{hero.eyebrow}</span>
            <h1>{hero.headline}</h1>
            <p className="hero-tagline">{hero.tagline}</p>
            <p className="hero-belief">{hero.belief}</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">
                לתיאום שיחת היכרות
              </Link>
              <a href="#services" className="btn btn-outline">
                להכיר את השירותים
              </a>
            </div>
          </div>
          <div className="hero-art">
            <span className="confetti-dot dot-1" aria-hidden="true"></span>
            <span className="confetti-dot dot-2" aria-hidden="true"></span>
            <span className="confetti-dot dot-3" aria-hidden="true"></span>
            <span className="confetti-dot dot-4" aria-hidden="true"></span>
            <Image className="hero-photo" src={michalPhoto} alt="מיכל רוניס בקליניקה" priority sizes="(max-width: 880px) 85vw, 380px" />
          </div>
        </div>
        <svg className="wave-divider" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 Q 150 0 300 30 T 600 30 T 900 30 T 1200 30 V60 H0 Z" fill="var(--color-bg-soft)" />
        </svg>
      </div>

      <div className="section" id="services">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow-home">השירותים שלנו</span>
            <h2>כל קושי – עם כתובת ברורה משלו</h2>
            <p>כמה מסלולים, כל אחד מותאם לצורך אחר. אפשר להיכנס ישר לקטגוריה הרלוונטית, בלי לחפש.</p>
          </div>
          <div className="cat-grid">
            <Link className="cat-card" href="/about">
              <span className="cat-mark" aria-hidden="true">
                <CategoryIcon name="leaf" />
              </span>
              <h3>אודות מיכל</h3>
              <p>{about.blurb}</p>
              <span className="go">לפרטים ←</span>
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} className="cat-card" href={`/services/${c.slug}`}>
                <span className="cat-mark" aria-hidden="true">
                  <CategoryIcon name={c.icon} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
                <span className="go">לפרטים ←</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow-home">מה אומרים</span>
            <h2>הורים ותלמידים מספרים</h2>
          </div>
          <Testimonials items={testimonials} short />
        </div>
      </div>
    </>
  );
}
