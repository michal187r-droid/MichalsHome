import type { Metadata } from "next";
import { testimonials, videoTestimonial } from "@/content/site";
import Testimonials from "@/components/Testimonials";
import FacebookVideo from "@/components/FacebookVideo";

export const metadata: Metadata = { title: "המלצות" };

export default function TestimonialsPage() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">המלצות</span>
          <h1>הורים ותלמידים מספרים</h1>
        </div>
        <div className="video-section">
          <FacebookVideo url={videoTestimonial.facebookUrl} title={videoTestimonial.title} length={videoTestimonial.length} />
          <div>
            <h2>{videoTestimonial.title}</h2>
            <p>כמה מהמילים החמות שקיבלתי לאורך השנים, בסרטון.</p>
          </div>
        </div>
        <Testimonials items={testimonials} />
        <p className="blog-note">הדברים נלקחו ממכתבי תודה והערכה שקיבלתי מהורים ומתלמידים. השמות הושמטו כדי לשמור על פרטיות המשפחות.</p>
      </div>
    </div>
  );
}
