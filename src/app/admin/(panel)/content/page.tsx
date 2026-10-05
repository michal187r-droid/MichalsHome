import Link from "next/link";
import { sections } from "@/lib/content-schema";

export default function ContentIndex() {
  return (
    <>
      <h1>עריכת האתר</h1>
      <p className="admin-hint">בוחרים חלק, משנים את הטקסט ולוחצים &quot;שמירה&quot;. האתר מתעדכן תוך כמה שניות.</p>
      <div className="admin-list">
        {sections.map((s) => (
          <Link key={s.key} href={`/admin/content/${s.key}`} className="admin-item admin-row-link">
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
