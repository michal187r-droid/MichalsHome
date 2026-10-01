type Item = { quote: string; who: string };

export default function Testimonials({ items }: { items: Item[] }) {
  return (
    <div className="testi-grid">
      {items.map((t) => (
        <div key={t.quote} className="testi-card">
          <p className="quote">״{t.quote}״</p>
          <p className="who">{t.who}</p>
        </div>
      ))}
    </div>
  );
}
