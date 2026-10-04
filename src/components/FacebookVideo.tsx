"use client";

import { useState } from "react";

// Facebook's player loads only after a click, so the page stays fast and
// visitors aren't tracked by Facebook unless they choose to watch.
export default function FacebookVideo({ url, title, length }: { url: string; title: string; length: string }) {
  const [playing, setPlaying] = useState(false);
  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&width=360`;

  return (
    <div className="video-card">
      {playing ? (
        <iframe
          src={src}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-facade" onClick={() => setPlaying(true)}>
          <span className="play" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
          <span className="label">לצפייה בסרטון</span>
          <span className="meta">{length} · נטען מפייסבוק</span>
        </button>
      )}
    </div>
  );
}
