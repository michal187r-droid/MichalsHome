import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "ניהול",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin">{children}</div>;
}
