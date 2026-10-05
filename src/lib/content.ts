import * as defaults from "@/content/site";
import type { Category, Testimonial } from "@/content/site";
import { CONTENT_TAG, publicClient } from "@/lib/supabase/public";

export type SiteContent = {
  hero: typeof defaults.hero;
  about: typeof defaults.about;
  contact: typeof defaults.contact;
  categories: Category[];
  testimonials: Testimonial[];
  video: typeof defaults.videoTestimonial;
};

export const CONTENT_KEYS = ["hero", "about", "contact", "categories", "testimonials", "video"] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const defaultContent: SiteContent = {
  hero: defaults.hero,
  about: defaults.about,
  contact: defaults.contact,
  categories: defaults.categories,
  testimonials: defaults.testimonials,
  video: defaults.videoTestimonial,
};

// Categories are fixed (their slugs are page URLs); only their text is editable.
function mergeCategories(saved: unknown): Category[] {
  if (!Array.isArray(saved)) return defaultContent.categories;
  return defaultContent.categories.map((base) => {
    const edit = saved.find((c) => c && typeof c === "object" && c.slug === base.slug);
    return edit ? { ...base, ...edit, slug: base.slug, icon: base.icon } : base;
  });
}

/** Site text: what Michal saved in the admin panel, else the built-in text. */
export async function getContent(): Promise<SiteContent> {
  const supabase = publicClient(CONTENT_TAG);
  if (!supabase) return defaultContent;

  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error || !data) return defaultContent;

  const saved = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    hero: { ...defaultContent.hero, ...saved.hero },
    about: { ...defaultContent.about, ...saved.about },
    contact: { ...defaultContent.contact, ...saved.contact },
    categories: mergeCategories(saved.categories),
    testimonials: Array.isArray(saved.testimonials) ? saved.testimonials : defaultContent.testimonials,
    video: { ...defaultContent.video, ...saved.video },
  };
}

export async function getCategory(slug: string) {
  const { categories } = await getContent();
  return categories.find((c) => c.slug === slug);
}
