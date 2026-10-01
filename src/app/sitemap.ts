import type { MetadataRoute } from "next";
import { categories } from "@/content/site";

const base = "https://michalronies.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/contact", "/blog", "/testimonials"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${base}/services/${c.slug}`, priority: 0.9 })),
  ];
}
