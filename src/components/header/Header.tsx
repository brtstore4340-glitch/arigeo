"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import styles from "./header.module.css";

type SubMenuItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
};

const menuItems: { th: MenuItem[]; en: MenuItem[] } = {
  th: [
    {
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
      label: "ความยั่งยืน",
      href: "/th/sustainability",
      submenu: [
        { label: "Clean World", href: "/th/sustainability#clean" },
        { label: "Beautiful Days", href: "/th/sustainability#beautiful" },
        { label: "Right Path", href: "/th/sustainability#path" },
      ],
    },
    {
      label: "นวัตกรรม",
      href: "/th/innovation",
      submenu: [
        { label: "R&D", href: "/th/innovation#rd" },
        { label: "Products", href: "/th/products" },
      ],
    },
    { label: "แบรนด์ของเรา", href: "/th/brands" },
    {
      label: "ข่าวสาร",
      href: "/th/newsroom",
      submenu: [
        { label: "Latest News", href: "/th/newsroom" },
        { label: "Press Releases", href: "/th/newsroom#press" },
      ],
    },
  ],
  en: [
    {
      label: "About Us",
      href: "/en/about",
      submenu: [
        { label: "About Us", href: "/en/about" },
        { label: "Sustainability", href: "/en/sustainability" },
        { label: "Innovation", href: "/en/innovation" },
        { label: "Our Brands", href: "/en/brands" },
        { label: "Newsroom", href: "/en/newsroom" },
        { label: "Careers", href: "/en/careers" },
      ],
    },
    {
      label: "Sustainability",
      href: "/en/sustainability",
      submenu: [
        { label: "Clean World", href: "/en/sustainability#clean" },
        { label: "Beautiful Days", href: "/en/sustainability#beautiful" },
        { label: "Right Path", href: "/en/sustainability#path" },
      ],
    },
    {
      label: "Innovation",
      href: "/en/innovation",
      submenu: [
        { label: "R&D", href: "/en/innovation#rd" },
        { label: "Products", href: "/en/products" },
      ],
    },
    { label: "Our Brands", href: "/en/brands" },
    {
      label: "Newsroom",
      href: "/en/newsroom",
      submenu: [
        { label: "Latest News", href: "/en/newsroom" },
        { label: "Press Releases", href: "/en/newsroom#press" },
      ],
    },
  ],
};

export default function Header() {
  const locale = useLocale() as "th" | "en";
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentMenuItems = menuItems[locale] || menuItems.en;

  // Scroll behavior - close menu on scroll down
  useEffect(() => {
    let lastY = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY) {
        // Scrolling down
        setMenuOpen(false);
        setActiveSub(null);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveSub(null);
  };

  const toggleSubmenu = (key: string) => {
    setActiveSub(activeSub === key ? null : key);
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href={locale === "th" ? "/th" : "/en"}>
          <img src="/images/logo.png" alt="ARIGEO" width={40} height={40} />
        </Link>
      </div>

      {/* Main Menu - shows when menuOpen is true */}
      {menuOpen && (
        <nav className={styles.mainMenu}>
          {currentMenuItems.map((item, idx) => (
            <div key={idx} className={styles.menuItem}>
              <div className={styles.menuItemContent}>
                <Link href={item.href}>{item.label}</Link>
                {item.submenu && (
                  <button
                    type="button"
                    className={styles.expandBtn}
                    onClick={() => toggleSubmenu(`menu-${idx}`)}
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    +
                  </button>
                )}
              </div>

              {/* Submenu */}
              {item.submenu && activeSub === `menu-${idx}` && (
                <div className={styles.submenu}>
                  {item.submenu.map((subitem, sidx) => (
                    <Link
                      key={sidx}
                      href={subitem.href}
                      className={styles.submenuLink}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Right Actions */}
      <div className={styles.actions}>
        <span className={styles.language}>{locale.toUpperCase()}</span>

        <button
          type="button"
          className={styles.searchBtn}
          aria-label="Search"
        >
          🔍
        </button>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
