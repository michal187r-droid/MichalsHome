import type { Testimonial } from "@/content/site";

export default function Testimonials({ items, short = false }: { items: Testimonial[]; short?: boolean }) {
  return (
    <div className="testi-grid">
      {items.map((t) => (
        <div key={t.who} className="testi-card">
          <p className="quote">״{short ? t.short : t.quote}״</p>
          <p className="who">{t.who}</p>
          {!short && t.reply?.trim() && (
            <div className="testi-reply">
              <p className="who">התשובה שלי</p>
              <p>{t.reply}</p>
            </div>
          )}
          {!short && t.followUp?.trim() && (
            <div className="testi-followup">
              <p>״{t.followUp}״</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
