"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import styles from "./mega-menu.module.css";

export type MenuItem = {
  label: string;
  href: string;
  submenu?: MenuItem[];
};

type Props = {
  items?: MenuItem[];
};

const defaultItems = {
  th: [
    {
      label: "เกี่ยวกับ ARIGEO",
      href: "/th/about",
      submenu: [
        { label: "จุดมุ่งหมายและการสร้างคุณค่า", href: "/th/about#purpose" },
        { label: "เกี่ยวกับ ARIGEO", href: "/th/about" },
        { label: "เกี่ยวกับบริษัท", href: "/th/about" },
        { label: "การปฏิบัติตามกฎระเบียบ", href: "/th/compliance" },
      ],
    },
    {
      label: "ความยั่งยืน",
      href: "/th/sustainability",
      submenu: [
        { label: "เพื่อโลกที่สะอาดและสมบูรณ์", href: "/th/sustainability#clean" },
        { label: "เพื่อทุกๆ วันที่งดงามมากขึ้น", href: "/th/sustainability#beautiful" },
        { label: "การก้าวเดินไปในทางที่ถูก", href: "/th/sustainability#path" },
      ],
    },
    {
      label: "นวัตกรรม",
      href: "/th/innovation",
    },
    {
      label: "แบรนด์ของเรา",
      href: "/th/brands",
    },
    {
      label: "ข่าวประชาสัมพันธ์",
      href: "/th/newsroom",
    },
    {
      label: "ร่วมงานกับเรา",
      href: "/th/careers",
    },
  ],
  en: [
    {
      label: "About ARIGEO",
      href: "/en/about",
      submenu: [
        { label: "Purpose & Value", href: "/en/about#purpose" },
        { label: "About ARIGEO", href: "/en/about" },
        { label: "About the company", href: "/en/about" },
        { label: "Compliance", href: "/en/compliance" },
      ],
    },
    {
      label: "Sustainability",
      href: "/en/sustainability",
      submenu: [
        { label: "Clean Planet", href: "/en/sustainability#clean" },
        { label: "Beautiful Days", href: "/en/sustainability#beautiful" },
        { label: "Right Path", href: "/en/sustainability#path" },
      ],
    },
    {
      label: "Innovation",
      href: "/en/innovation",
    },
    {
      label: "Our Brands",
      href: "/en/brands",
    },
    {
      label: "News",
      href: "/en/newsroom",
    },
    {
      label: "Careers",
      href: "/en/careers",
    },
  ],
} as const;

export default function MegaMenu({ items }: Props) {
  const locale = useLocale() === "th" ? "th" : "en";
  const menuItems = items ?? defaultItems[locale];
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className={styles.megaMenu} role="navigation" aria-label="Main menu">
      {/* Hamburger Button (mobile) */}
      <button
        className={styles.hamburger}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu Container */}
      <ul className={`${styles.menuList} ${mobileOpen ? styles.open : ""}`}>
        {menuItems.map((item) => (
          <li key={item.label} className={styles.menuItem}>
            <Link
              href={item.href}
              className={styles.menuLink}
              onClick={() => {
                if ('submenu' in item && item.submenu) {
                  setOpenSubmenu(
                    openSubmenu === item.label ? null : item.label
                  );
                } else {
                  setMobileOpen(false);
                }
              }}
            >
              {item.label}
              {'submenu' in item && item.submenu && (
                <span
                  className={`${styles.chevron} ${
                    openSubmenu === item.label ? styles.open : ""
                  }`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              )}
            </Link>

            {/* Submenu */}
            {'submenu' in item && item.submenu && (
              <ul className={`${styles.submenu} ${
                openSubmenu === item.label ? styles.open : ""
              }`}>
                {item.submenu.map((subitem) => (
                  <li key={subitem.label}>
                    <Link
                      href={subitem.href}
                      className={styles.submenuLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {subitem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Backdrop (mobile) */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
