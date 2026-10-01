import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, whatsappHref } from "@/content/site";
import { WhatsAppIcon } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: c.title, description: c.tagline } : {};
}

export default async function CategoryPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();

  const wa = whatsappHref(c.whatsappMessage);
  const contactHref = `/contact?service=${c.slug}`;

  return (
    <div className="section">
      <div className="wrap">
        <div className="cat-hero">
          <span className="eyebrow-home">
            <Link href="/#services">השירותים שלנו</Link>
          </span>
          <h1>{c.title}</h1>
          <p className="hero-tagline">{c.tagline}</p>
        </div>

        <div className="cat-columns">
          <div>
            {c.story && (
              <section className="story">
                <h2>{c.story.heading}</h2>
                {c.story.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <h2 style={{ marginTop: 28 }}>{c.story.pillarsHeading}</h2>
                <div className="pillars">
                  {c.story.pillars.map((p) => (
                    <div key={p.title} className="pillar">
                      <span className="emoji" aria-hidden="true">
                        {p.emoji}
                      </span>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                    </div>
                  ))}
                </div>
                <div className="closing">
                  <p className="closing-line">{c.story.closing}</p>
                  <p>{c.story.callToAction}</p>
                  <div className="hero-actions">
                    <a href={wa} target="_blank" rel="noopener" className="btn btn-wa">
                      <WhatsAppIcon size={20} /> שליחת הודעה בוואטסאפ
                    </a>
                    <Link href={contactHref} className="btn btn-outline">
                      השארת פרטים בטופס
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <h2>מה קורה בתהליך</h2>
            <ol className="process-steps">
              {c.steps.map((s) => (
                <li key={s.title}>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 style={{ marginTop: 36 }}>שאלות נפוצות</h2>
            {c.faq.map((f, i) => (
              <details key={f.q} className="faq-item" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <aside className="cat-aside">
            <div className="info-card">
              <dl>
                {c.info.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Link href={contactHref} className="btn btn-primary">
              {c.ctaLabel}
            </Link>
            <a href={wa} target="_blank" rel="noopener" className="btn btn-wa">
              <WhatsAppIcon size={20} /> וואטסאפ למיכל
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
