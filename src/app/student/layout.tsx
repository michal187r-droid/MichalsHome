import type { Metadata } from "next";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "האזור האישי",
  robots: { index: false, follow: false },
};

export default function StudentRootLayout({ children }: LayoutProps<"/student">) {
  return <div className="admin student">{children}</div>;
}
