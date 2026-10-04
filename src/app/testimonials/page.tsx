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
          <h1>הורים ותלמידים מספרים</h1>
        </div>
        <Testimonials items={testimonials} />
        <p className="blog-note">הדברים נלקחו ממכתבי תודה והערכה שקיבלתי מהורים ומתלמידים בתקופה שבה לימדתי וחינכתי בבית הספר. השמות הושמטו כדי לשמור על פרטיות המשפחות.</p>
      </div>
    </div>
  );
}
