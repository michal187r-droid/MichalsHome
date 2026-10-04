import type { Testimonial } from "@/content/site";

export default function Testimonials({ items, short = false }: { items: Testimonial[]; short?: boolean }) {
  return (
    <div className="testi-grid">
      {items.map((t) => (
        <div key={t.who} className="testi-card">
          <p className="quote">״{short ? t.short : t.quote}״</p>
          <p className="who">{t.who}</p>
        </div>
      ))}
    </div>
  );
}
