"use client";

import React, { useState } from "react";
import Link from "next/link";

function IconSearch() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
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
      {
        key: "sustainability-approach",
        label: "Sustainability approach",
        href: "/sustainability",
      },
      {
        key: "env-society",
        label: "Environment & society",
        href: "/sustainability",
      },
    ],
  },
  {
    key: "innovation",
    label: "Innovation",
    href: "/innovation",
    children: [
      {
        key: "research-dev",
        label: "Research & development",
        href: "/innovation",
      },
      {
        key: "product-dev",
        label: "Product development",
        href: "/innovation",
      },
    ],
  },
  {
    key: "brands",
    label: "Our Brands",
    href: "/brands",
    children: [],
  },
  {
    key: "news",
    label: "Newsroom",
    href: "/newsroom",
    children: [
      { key: "news-release", label: "News release", href: "/newsroom" },
      { key: "arigeo-stories", label: "ARIGEO stories", href: "/newsroom" },
    ],
  },
  {
    key: "careers",
    label: "Careers",
    href: "/careers",
    children: [],
  },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      style={{
        position: "relative",
        zIndex: 70,
        background: "#fff",
        color: "#111",
        borderBottom: "1px solid #ddd",
        fontFamily: "var(--font-sans)",
      }}
      role="banner"
    >
      <style>{`
        .ds-header-desktop-nav, .ds-header-utility-nav { display: flex; }
        .ds-header-hamburger { display: none; }
        @media (max-width: 1023px) {
          .ds-header-desktop-nav, .ds-header-utility-nav { display: none; }
          .ds-header-hamburger { display: flex; }
        }
      `}</style>
      <div
        style={{
          height: 80,
          maxWidth: 1440,
          margin: "auto",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="ARIGEO home"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <img
            src="/images/logo.png"
            alt="ARIGEO logo"
            style={{
              height: "72%",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="ds-header-desktop-nav"
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            justifyContent: "flex-end",
          }}
        >
          <ul
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {navItems.map((item) => {
              const open = openMenu === item.key;
              return (
                <li
                  key={item.key}
                  style={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                  }}
                  onMouseEnter={() =>
                    item.children?.length && setOpenMenu(item.key)
                  }
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {item.children && item.children.length > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(open ? null : item.key)
                      }
                      style={{
                        height: "100%",
                        border: 0,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 17,
                        padding: "0 18px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        color: "#111",
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                      <span aria-hidden="true">＋</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontSize: 17,
                        padding: "0 18px",
                        whiteSpace: "nowrap",
                        color: "#111",
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && item.children.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        width: 440,
                        padding: 24,
                        background: "#fff",
                        border: "1px solid #ddd",
                        boxShadow: "0 16px 40px rgba(17,17,17,.18)",
                        opacity: open ? 1 : 0,
                        visibility: open ? "visible" : "hidden",
                        transform: `translate(-50%, ${open ? 0 : 8}px)`,
                        transition: ".25s ease, transform .25s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0 0 16px",
                          fontSize: 20,
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <Link
                          href={item.href}
                          style={{
                            textDecoration: "none",
                            color: "#111",
                          }}
                        >
                          {item.label}
                        </Link>
                        <span aria-hidden="true">→</span>
                      </div>
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: "8px 0 0",
                        }}
                      >
                        {item.children.map((c) => (
                          <li key={c.key}>
                            <Link
                              href={c.href}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "12px 4px",
                                borderBottom: "1px solid #eee",
                                color: "#111",
                                textDecoration: "none",
                              }}
                            >
                              {c.label}
                              <span aria-hidden="true">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Utility Navigation */}
        <nav
          aria-label="Utility navigation"
          className="ds-header-utility-nav"
          style={{
            alignItems: "center",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            style={{
              height: "100%",
              padding: "0 19px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: 0,
              borderLeft: "1px solid #e1e1e1",
              background: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: "#111",
              fontFamily: "inherit",
            }}
            aria-label="Switch to Thai"
          >
            <IconGlobe />
            TH
          </button>
          <button
            type="button"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            style={{
              height: "100%",
              minWidth: 58,
              justifyContent: "center",
              padding: "0 19px",
              display: "flex",
              alignItems: "center",
              border: 0,
              borderLeft: "1px solid #e1e1e1",
              background: "#fff",
              cursor: "pointer",
              color: "#111",
              fontFamily: "inherit",
            }}
            aria-label="Search"
          >
            <IconSearch />
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
              Search
            </span>
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="ds-header-hamburger"
          style={{
            width: 44,
            height: 44,
            padding: 10,
            border: 0,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 5,
            cursor: "pointer",
            marginLeft: "auto",
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: "block", width: 24, height: 2, background: "#111" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#111" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#111" }} />
        </button>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <form
          style={{
            position: "absolute",
            top: 80,
            right: 48,
            zIndex: 90,
            width: "min(520px, calc(100% - 40px))",
            padding: 18,
            background: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,.12)",
            display: "flex",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            autoFocus
            placeholder="Search"
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #aaa",
              padding: "12px 14px",
              fontFamily: "inherit",
            }}
            aria-label="Search products"
          />
          <button
            type="submit"
            style={{
              width: 50,
              border: 0,
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
            aria-label="Submit search"
          >
            <IconSearch />
          </button>
        </form>
      )}
    </header>
  );
}
