import type { Metadata } from "next";
import { testimonials } from "@/content/site";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = { title: "המלצות" };

export default function TestimonialsPage() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">המלצות</span>
          <h1>הורים ואנשי חינוך מספרים</h1>
        </div>
        <Testimonials items={testimonials} />
        <p className="blog-note">חוות הדעת שלעיל הן דוגמה להמחשה. מומלץ להחליפן בהמלצות אמיתיות, באישור ההורים/המוסדות.</p>
      </div>
    </div>
  );
}
