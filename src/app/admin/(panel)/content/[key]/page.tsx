import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { getSection } from "@/lib/content-schema";
import ContentEditor from "./ContentEditor";

export default async function EditSectionPage({ params }: PageProps<"/admin/content/[key]">) {
  const { key } = await params;
  const section = getSection(key);
  if (!section) notFound();

  const content = await getContent();
  const value = content[section.key];

  return (
    <>
      <Link href="/admin/content" className="admin-link">
        → חזרה לכל החלקים
      </Link>
      <h1>{section.title}</h1>
      <p className="admin-hint">{section.description}</p>
      <ContentEditor sectionKey={section.key} initial={JSON.parse(JSON.stringify(value))} />
    </>
  );
}
