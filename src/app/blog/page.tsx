import type { Metadata } from "next";
import { blogPosts } from "@/content/site";

export const metadata: Metadata = { title: "בלוג" };

export default function BlogPage() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow-home">בלוג</span>
          <h1>תוכן מקצועי, כתוב בשפה פשוטה</h1>
          <p>מאמרים וטיפים לפי אותן קטגוריות שירות, כדי שתמצאו בדיוק את מה שרלוונטי לכם.</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.title} className="blog-card">
              <div className="blog-thumb"></div>
              <div className="pad">
                <span className="tag">{post.tag}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="blog-note">התוכן בעמוד זה הוא דוגמה ראשונית להמחשת מבנה הבלוג – ניתן להחליפו במאמרים אמיתיים.</p>
      </div>
    </div>
  );
}
