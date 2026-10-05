import type { Metadata } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.michalronies.co.il"),
  title: {
    default: "הבית של מיכל – למידה מותאמת שפתית רגשית",
    template: "%s | הבית של מיכל",
  },
  description:
    "למידה אישית במקצועות רבי‐מלל, והוראה מותאמת שפתית-רגשית לילדים ובני נוער מכיתה ג' ועד י\"ב. קליניקה בקיבוץ נען.",
  icons: { icon: "/logo-icon.png" },
  // Preview card when the link is shared on WhatsApp / Facebook.
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "הבית של מיכל",
    images: [{ url: "/logo-full.png", width: 500, height: 493, alt: "הבית של מיכל" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${assistant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
