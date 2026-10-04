"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/content/site";

const links = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות מיכל" },
];
const trailingLinks = [
  { href: "/testimonials", label: "המלצות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close menus after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="logo" href="/" aria-label="הבית של מיכל – דף הבית">
          <Image src="/logo-nav.png" alt="הבית של מיכל" width={480} height={350} priority />
        </Link>
        <button
          className="menu-toggle"
          aria-label="פתיחת תפריט"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`main-nav${menuOpen ? " open" : ""}`}>
          <ul className="nav-list">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(l.href) ? "active" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className={`services-drop${servicesOpen ? " open" : ""}`}>
              <button
                type="button"
                className={`nav-link${pathname.startsWith("/services") ? " active" : ""}`}
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((o) => !o)}
              >
                השירותים שלנו
              </button>
              <div className="services-panel">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/services/${c.slug}`}>
                    {c.title}
                  </Link>
                ))}
              </div>
            </li>
            {trailingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(l.href) ? "active" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/contact" className="nav-cta">
          תיאום שיחת היכרות
        </Link>
      </div>
    </header>
  );
}
