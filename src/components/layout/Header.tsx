"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./header.module.css";

export type MenuItem = {
  label: string;
  href: string;
  submenu?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("en");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
  }, [isSearchOpen]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "th" : "en");
  }, [locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
    setSearchQuery("");
  };

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
        role="banner"
      >
        {/* Top Bar */}
        <div className={styles.topBar}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" aria-label="ARIGEO Home" className={styles.logoLink}>
              <img
                src="/images/logo.png"
                alt="ARIGEO"
                className={styles.logoImg}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} role="navigation">
            <ul className={styles.navList}>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section: Search + Locale + Mobile Menu */}
          <div className={styles.rightSection}>
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className={styles.iconButton}
              aria-label="Search"
              aria-expanded={isSearchOpen}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="8" cy="8" r="6" strokeWidth="1.5" />
                <path d="M12 12l4 4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Language Selector */}
            <button
              onClick={toggleLocale}
              className={styles.localeButton}
              aria-label={`Switch language to ${locale === "en" ? "Thai" : "English"}`}
              type="button"
            >
              {locale.toUpperCase()}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              type="button"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className={styles.searchBar}>
            <form onSubmit={handleSearch}>
              <input
                type="search"
                placeholder={locale === "en" ? "Search products..." : "ค้นหาสินค้า..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
                aria-label="Search products"
              />
              <button type="submit" aria-label="Submit search" className={styles.searchSubmit}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M12 12l4 4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && <div className={styles.backdrop} onClick={() => setIsMenuOpen(false)} />}
      <nav
        className={`${styles.mobileDrawer} ${isMenuOpen ? styles.open : ""}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className={styles.closeButton}
          aria-label="Close menu"
          type="button"
        >
          ✕
        </button>
        <ul className={styles.mobileNavList}>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
