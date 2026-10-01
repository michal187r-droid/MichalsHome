import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">404</span>
          <h1>העמוד לא נמצא</h1>
          <p>ייתכן שהקישור השתנה. אפשר לחזור לדף הבית או ליצור קשר ישירות.</p>
        </div>
        <div className="hero-actions">
          <Link href="/" className="btn btn-primary">
            לדף הבית
          </Link>
          <Link href="/contact" className="btn btn-outline">
            צור קשר
          </Link>
        </div>
      </div>
    </div>
  );
}
