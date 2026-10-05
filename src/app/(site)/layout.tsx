import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { categories, contact } = await getContent();
  const services = categories.map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <>
      <a className="skip-link" href="#main">
        דלג לתוכן
      </a>
      <Header services={services} />
      <main id="main">{children}</main>
      <Footer services={services} whatsapp={contact.whatsapp} />
    </>
  );
}
