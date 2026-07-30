"use client";

import React, { useState } from "react";
import Link from "next/link";

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm7.94 9h-3.05c-.09-2.09-.5-4.05-1.19-5.62A8.01 8.01 0 0 1 19.94 11zM12 4.05c.86 1.35 1.5 3.6 1.63 6.95H10.37c.13-3.35.77-5.6 1.63-6.95zM10.37 13h3.26c-.13 3.35-.77 5.6-1.63 6.95-.86-1.35-1.5-3.6-1.63-6.95zM8.3 5.38C7.6 6.95 7.19 8.91 7.11 11H4.06a8.01 8.01 0 0 1 4.24-5.62zM4.06 13h3.05c.08 2.09.49 4.05 1.19 5.62A8.01 8.01 0 0 1 4.06 13zm7.64 6.62c.69-1.57 1.1-3.53 1.19-5.62h3.05a8.01 8.01 0 0 1-4.24 5.62z" />
    </svg>
  );
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    key: "about",
    label: "About Us",
    href: "/about",
    children: [
      { key: "about-arigeo", label: "About ARIGEO", href: "/about" },
      { key: "core-values", label: "Our core value", href: "/about#core-values" },
    ],
  },
  {
    key: "sustainability",
    label: "Sustainability",
    href: "/sustainability",
    children: [
      { key: "sustainability-approach", label: "Sustainability approach", href: "/sustainability" },
      { key: "env-society", label: "Environment & society", href: "/sustainability" },
    ],
  },
  {
    key: "innovation",
    label: "Innovation",
    href: "/innovation",
    children: [
      { key: "research-dev", label: "Research & development", href: "/innovation" },
      { key: "product-dev", label: "Product development", href: "/innovation" },
    ],
  },
  { key: "brands", label: "Our Brands", href: "/brands", children: [] },
  {
    key: "news",
    label: "Newsroom",
    href: "/newsroom",
    children: [
      { key: "news-release", label: "News release", href: "/newsroom" },
      { key: "arigeo-stories", label: "ARIGEO stories", href: "/newsroom" },
    ],
  },
  { key: "careers", label: "Careers", href: "/careers", children: [] },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveSub(null);
  };

  return (
    <header className="siz-site-nav" role="banner">
      <div className="siz-site-nav__wrapper">
        <button
          type="button"
          className={`siz-site-nav-burger ${menuOpen ? "is-active" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((current) => !current);
            setActiveSub(null);
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <Link href="/" className="siz-site-nav__logo" aria-label="ARIGEO home" onClick={closeMenu}>
          <img src="/images/logo.png" alt="ARIGEO logo" />
        </Link>

        <nav className={`siz-site-nav-main ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <div className="siz-site-nav-main__wrapper">
            <ul className="siz-site-nav-main__list">
              {navItems.map((item) => (
                <li key={item.key} className="siz-site-nav-main__item">
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button
                        type="button"
                        className="siz-site-nav-main__link"
                        aria-expanded={activeSub === item.key}
                        onClick={() => setActiveSub(activeSub === item.key ? null : item.key)}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true">+</span>
                      </button>
                      <ul className={`siz-site-nav-sub ${activeSub === item.key ? "is-open" : ""}`}>
                        {item.children.map((child) => (
                          <li key={child.key}>
                            <Link href={child.href} className="siz-site-nav-sub__link" onClick={closeMenu}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={item.href} className="siz-site-nav-main__link" onClick={closeMenu}>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <nav className="siz-site-nav__actions" aria-label="Utility navigation">
          <button type="button" className="siz-site-nav__action" aria-label="Switch to Thai">
            <IconGlobe />
            <span>TH</span>
          </button>
          <button
            type="button"
            className="siz-site-nav__action"
            aria-expanded={searchOpen}
            aria-label="Search"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <IconSearch />
          </button>
        </nav>
      </div>

      {searchOpen && (
        <form className="siz-site-nav-search" onSubmit={(e) => e.preventDefault()}>
          <input autoFocus placeholder="Search" aria-label="Search products" />
          <button type="submit" aria-label="Submit search">
            <IconSearch />
          </button>
        </form>
      )}
    </header>
  );
}
