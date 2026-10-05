import type { MetadataRoute } from "next";
import { defaultContent } from "@/lib/content";

const base = "https://www.michalronies.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/contact", "/testimonials", "/questions"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, priority: p === "" ? 1 : 0.6 })),
    ...defaultContent.categories.map((c) => ({ url: `${base}/services/${c.slug}`, priority: 0.9 })),
  ];
}
