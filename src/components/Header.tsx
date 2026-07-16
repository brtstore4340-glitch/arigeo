"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Globe, Search, Menu, X } from "lucide-react";

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navKeys = ["about", "brands", "products", "innovation", "sustainability", "news", "careers", "contact"] as const;

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "th" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="site-header">
      <div className="shell header-inner">
        {/* Brand Logo */}
        <Link className="brand" href="/" aria-label="ARIGEO home">
          <span>ARIGE</span><i />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navKeys.map((key) => (
            <Link key={key} href={key === 'about' ? '/about' : key === 'brands' ? '/brands' : key === 'innovation' ? '/innovation' : key === 'sustainability' ? '/sustainability' : key === 'contact' ? '/contact' : '#'}>
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="header-actions">
          <button onClick={toggleLanguage} className="ghost-btn language">
            <Globe size={18} /> {t("language")} <span>⌄</span>
          </button>
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button
            className="lg:hidden icon-btn"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden border-t border-[#e9e9e9] bg-white px-6 py-4 shadow-lg absolute top-full left-0 right-0 z-50">
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={key === 'about' ? '/about' : key === 'brands' ? '/brands' : key === 'innovation' ? '/innovation' : key === 'sustainability' ? '/sustainability' : key === 'contact' ? '/contact' : '#'}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-[#111] hover:text-[var(--red)] transition-colors"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
