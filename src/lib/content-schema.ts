import type { ContentKey } from "./content";

// Describes the editable fields of each site section, so one generic
// editor can render a form for any of them.
export type Field =
  | { kind: "text" | "textarea"; key: string; label: string; hint?: string }
  | { kind: "list"; key: string; label: string; itemLabel: string; multiline?: boolean }
  | { kind: "object"; key: string; label: string; fields: Field[] }
  | { kind: "objects"; key: string; label: string; itemLabel: string; fields: Field[]; fixed?: boolean; titleKey?: string };

export type Section = {
  key: ContentKey;
  title: string;
  description: string;
  /** "object" sections edit one record; "objects" sections edit a list. */
  root: { kind: "object"; fields: Field[] } | { kind: "objects"; itemLabel: string; fields: Field[]; fixed?: boolean; titleKey?: string };
};

const storyFields: Field[] = [
  { kind: "text", key: "heading", label: "כותרת הפתיחה" },
  { kind: "list", key: "paragraphs", label: "פסקאות פתיחה", itemLabel: "פסקה", multiline: true },
  { kind: "textarea", key: "highlight", label: "תיבה מודגשת (לא חובה)", hint: "מופיעה בכתום לפני \"מה זה אומר?\". אפשר להשאיר ריק." },
  { kind: "text", key: "pillarsHeading", label: "כותרת הכרטיסים" },
  {
    kind: "objects",
    key: "pillars",
    label: "כרטיסים",
    itemLabel: "כרטיס",
    titleKey: "title",
    fields: [
      { kind: "text", key: "emoji", label: "אימוג׳י" },
      { kind: "text", key: "title", label: "כותרת" },
      { kind: "textarea", key: "text", label: "טקסט" },
    ],
  },
  { kind: "text", key: "closing", label: "משפט סיום" },
  { kind: "textarea", key: "callToAction", label: "הזמנה לפנות" },
];

export const sections: Section[] = [
  {
    key: "hero",
    title: "עמוד הבית – החלק העליון",
    description: "הכותרת, המשפטים והאמונה שבראש עמוד הבית.",
    root: {
      kind: "object",
      fields: [
        { kind: "text", key: "eyebrow", label: "שורה קטנה מעל הכותרת" },
        { kind: "text", key: "headline", label: "כותרת ראשית" },
        { kind: "textarea", key: "tagline", label: "משפט מתחת לכותרת" },
        { kind: "textarea", key: "belief", label: "משפט \"אני מאמינה\"" },
      ],
    },
  },
  {
    key: "categories",
    title: "השירותים (4 הקטגוריות)",
    description: "כל הטקסטים של עמודי השירותים, והתיאור הקצר שמופיע בעמוד הבית.",
    root: {
      kind: "objects",
      itemLabel: "שירות",
      fixed: true,
      titleKey: "title",
      fields: [
        { kind: "text", key: "title", label: "שם השירות" },
        { kind: "textarea", key: "blurb", label: "תיאור קצר (בכרטיס בעמוד הבית)" },
        { kind: "textarea", key: "tagline", label: "משפט פתיחה (מתחת לכותרת בעמוד)" },
        { kind: "object", key: "story", label: "הטקסט האישי בעמוד", fields: storyFields },
        {
          kind: "objects",
          key: "steps",
          label: "מה קורה בתהליך",
          itemLabel: "שלב",
          titleKey: "title",
          fields: [
            { kind: "text", key: "title", label: "שם השלב" },
            { kind: "textarea", key: "text", label: "הסבר" },
          ],
        },
        {
          kind: "objects",
          key: "faq",
          label: "שאלות נפוצות",
          itemLabel: "שאלה",
          titleKey: "q",
          fields: [
            { kind: "text", key: "q", label: "שאלה" },
            { kind: "textarea", key: "a", label: "תשובה" },
          ],
        },
        {
          kind: "objects",
          key: "info",
          label: "כרטיס הפרטים (בצד העמוד)",
          itemLabel: "שורה",
          titleKey: "label",
          fields: [
            { kind: "text", key: "label", label: "כותרת" },
            { kind: "text", key: "value", label: "ערך" },
          ],
        },
        { kind: "text", key: "ctaLabel", label: "טקסט הכפתור" },
        { kind: "textarea", key: "whatsappMessage", label: "הודעת וואטסאפ מוכנה" },
      ],
    },
  },
  {
    key: "about",
    title: "עמוד אודותיי",
    description: "הכותרת, הטקסט, ההשכלה וההסמכות.",
    root: {
      kind: "object",
      fields: [
        { kind: "textarea", key: "headline", label: "כותרת" },
        { kind: "textarea", key: "lead", label: "שורת משנה" },
        { kind: "list", key: "paragraphs", label: "פסקאות", itemLabel: "פסקה", multiline: true },
        { kind: "list", key: "credentials", label: "השכלה והסמכות", itemLabel: "שורה" },
        { kind: "list", key: "values", label: "רשימת הערכים", itemLabel: "שורה" },
      ],
    },
  },
  {
    key: "testimonials",
    title: "המלצות",
    description: "הגרסה הקצרה מופיעה בעמוד הבית, והמלאה בעמוד ההמלצות. הסדר כאן הוא הסדר באתר.",
    root: {
      kind: "objects",
      itemLabel: "המלצה",
      titleKey: "who",
      fields: [
        { kind: "text", key: "who", label: "חתימה (מי כתב)" },
        { kind: "textarea", key: "short", label: "גרסה קצרה (עמוד הבית)" },
        { kind: "textarea", key: "quote", label: "גרסה מלאה (עמוד ההמלצות)" },
        { kind: "textarea", key: "reply", label: "התשובה שלי (לא חובה)", hint: "מופיעה מתחת להמלצה בעמוד ההמלצות. אפשר להשאיר ריק." },
        { kind: "textarea", key: "followUp", label: "תגובה חוזרת (לא חובה)", hint: "מה שכתבו בחזרה אחרי התשובה שלי. אפשר להשאיר ריק." },
      ],
    },
  },
  {
    key: "video",
    title: "סרטון ההמלצות",
    description: "הסרטון מפייסבוק בעמוד ההמלצות.",
    root: {
      kind: "object",
      fields: [
        { kind: "text", key: "title", label: "כותרת" },
        { kind: "text", key: "facebookUrl", label: "קישור לסרטון בפייסבוק" },
        { kind: "text", key: "length", label: "אורך הסרטון (למשל: כ-2 דקות)" },
      ],
    },
  },
  {
    key: "contact",
    title: "פרטי קשר",
    description: "טלפון, וואטסאפ, מייל ואזור – בכל האתר.",
    root: {
      kind: "object",
      fields: [
        { kind: "text", key: "phone", label: "טלפון (כפי שיוצג)" },
        { kind: "text", key: "whatsapp", label: "מספר וואטסאפ בפורמט בינלאומי", hint: "למשל 972522232274 – בלי 0 בהתחלה ובלי מקפים" },
        { kind: "text", key: "email", label: "אימייל" },
        { kind: "text", key: "area", label: "אזור פעילות" },
      ],
    },
  },
];

export function getSection(key: string) {
  return sections.find((s) => s.key === key);
}
