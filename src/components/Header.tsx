"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import styles from "./header.module.css";

type SubMenuItem = {
  label: string;
  href: string;
};

type MenuItem = {
  key: string;
  label: string;
  href: string;
  submenu?: SubMenuItem[];
};

const menuItems: Record<"th" | "en", MenuItem[]> = {
  th: [
    {
      key: "about",
      label: "เกี่ยวกับเรา",
      href: "/th/about",
      submenu: [
        { label: "About Us", href: "/th/about" },
        { label: "Sustainability", href: "/th/sustainability" },
        { label: "Innovation", href: "/th/innovation" },
        { label: "Our Brands", href: "/th/brands" },
        { label: "Newsroom", href: "/th/newsroom" },
        { label: "Careers", href: "/th/careers" },
      ],
    },
    {
      key: "sustainability",
      label: "ความยั่งยืน",
      href: "/th/sustainability",
      submenu: [
        { label: "Clean World", href: "/th/sustainability#clean" },
        { label: "Beautiful Days", href: "/th/sustainability#beautiful" },
        { label: "Right Path", href: "/th/sustainability#path" },
      ],
    },
    {
      key: "innovation",
      label: "นวัตกรรม",
      href: "/th/innovation",
      submenu: [
        { label: "R&D", href: "/th/innovation#rd" },
        { label: "Products", href: "/th/products" },
      ],
    },
    { key: "brands", label: "แบรนด์ของเรา", href: "/th/brands" },
    {
      key: "news",
      label: "ข่าวสาร",
      href: "/th/newsroom",
      submenu: [
        { label: "Latest News", href: "/th/newsroom" },
        { label: "Press Releases", href: "/th/newsroom#press" },
      ],
    },
    { key: "careers", label: "ร่วมงานกับเรา", href: "/th/careers" },
  ],
  en: [
    {
      key: "about",
      label: "About Us",
      href: "/en/about",
      submenu: [
        { label: "About ARIGEO", href: "/en/about" },
        { label: "Sustainability", href: "/en/sustainability" },
        { label: "Innovation", href: "/en/innovation" },
        { label: "Our Brands", href: "/en/brands" },
        { label: "Newsroom", href: "/en/newsroom" },
        { label: "Careers", href: "/en/careers" },
      ],
    },
    {
      key: "sustainability",
      label: "Sustainability",
      href: "/en/sustainability",
      submenu: [
        { label: "Clean World", href: "/en/sustainability#clean" },
        { label: "Beautiful Days", href: "/en/sustainability#beautiful" },
        { label: "Right Path", href: "/en/sustainability#path" },
      ],
    },
    {
      key: "innovation",
      label: "Innovation",
      href: "/en/innovation",
      submenu: [
        { label: "R&D", href: "/en/innovation#rd" },
        { label: "Products", href: "/en/products" },
      ],
    },
    { key: "brands", label: "Our Brands", href: "/en/brands" },
    {
      key: "news",
      label: "Newsroom",
      href: "/en/newsroom",
      submenu: [
        { label: "Latest News", href: "/en/newsroom" },
        { label: "Press Releases", href: "/en/newsroom#press" },
      ],
    },
    { key: "careers", label: "Careers", href: "/en/careers" },
  ],
};

export default function Header() {
  const locale = useLocale() as "th" | "en";
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);

  const currentMenuItems = menuItems[locale] || menuItems.en;
  const otherLocale = locale === "th" ? "en" : "th";
  const isExpanded = expanded || mobileOpen || searchOpen || openMenu !== null;

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastScrollY.current;
      lastScrollY.current = nextY;

      if (nextY < 28 || delta < -6) {
        setExpanded(true);
        return;
      }

      if (delta > 8) {
        setExpanded(false);
        setOpenMenu(null);
        setSearchOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    router.replace(pathname, { locale: otherLocale });
  };

  const collapseIfAway = () => {
    if (window.scrollY > 48) setExpanded(false);
  };

  const collapseAfterBlur = () => {
    window.setTimeout(() => {
      if (!headerRef.current?.contains(document.activeElement) && window.scrollY > 48) {
        setExpanded(false);
        setOpenMenu(null);
        setSearchOpen(false);
      }
    }, 0);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-expanded={isExpanded ? "true" : "false"}
      data-mobile-open={mobileOpen ? "true" : "false"}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={collapseIfAway}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={collapseAfterBlur}
    >
      <div className={styles.shell}>
        <Link href={locale === "th" ? "/th" : "/en"} aria-label="ARIGEO home" className={styles.brand}>
          <span className={styles.brandMark}>
            <img src="/images/logos/arigeo-transparent.png" alt="" />
          </span>
          <span className={styles.brandText}>ARIGEO</span>
        </Link>

        <nav aria-label="Primary navigation" className={styles.desktopNav}>
          <ul className={styles.navList}>
            {currentMenuItems.map((item) => {
              const open = openMenu === item.key;
              return (
                <li
                  key={item.key}
                  className={styles.navItem}
                  onMouseEnter={() => item.submenu?.length && setOpenMenu(item.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {item.submenu?.length ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      className={styles.navButton}
                      onClick={() => setOpenMenu(open ? null : item.key)}
                    >
                      {item.label}
                      <span aria-hidden="true">+</span>
                    </button>
                  ) : (
                    <Link href={item.href} className={styles.navLink}>
                      {item.label}
                    </Link>
                  )}

                  {item.submenu?.length ? (
                    <div className={styles.dropdown} data-open={open ? "true" : "false"}>
                      <Link href={item.href} className={styles.dropdownTop}>
                        {item.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                      <ul className={styles.dropdownList}>
                        {item.submenu.map((child) => (
                          <li key={child.label}>
                            <Link href={child.href} className={styles.dropdownLink}>
                              {child.label}
                              <span aria-hidden="true">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label="Utility navigation" className={styles.utilityNav}>
          <button type="button" onClick={switchLocale} className={styles.utilityButton}>
            {otherLocale.toUpperCase()}
          </button>
          <button
            type="button"
            aria-expanded={searchOpen}
            onClick={() => {
              setExpanded(true);
              setSearchOpen((value) => !value);
            }}
            className={styles.utilityButton}
          >
            <Search size={17} />
            <span className="sr-only">Search</span>
          </button>
        </nav>

        <span className={styles.menuHint} aria-hidden="true">
          <span className={styles.menuHintDot} />
          Menu
        </span>

        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => {
            setExpanded(true);
            setMobileOpen((value) => !value);
          }}
          className={styles.mobileToggle}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {searchOpen ? (
        <form className={styles.searchForm}>
          <input autoFocus placeholder="Search" className={styles.searchInput} />
          <button type="submit" className={styles.searchSubmit}>
            <Search size={18} />
            <span className="sr-only">Submit search</span>
          </button>
        </form>
      ) : null}

      {mobileOpen ? (
        <div className={styles.mobilePanel}>
          {currentMenuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              switchLocale();
              setMobileOpen(false);
            }}
            className={styles.mobileLocale}
          >
            Switch to {otherLocale.toUpperCase()}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}
