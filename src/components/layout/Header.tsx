"use client";

import React, { useState, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [interactionReveal, setInteractionReveal] = useState(false);

  const revealHeader = () => {
    setHeaderHidden(false);
    setInteractionReveal(true);
  };

  const releaseHeader = () => {
    if (window.scrollY > 120 && !menuOpen && !searchOpen) {
      setInteractionReveal(false);
    }
  };

  // Invisible UI pattern: hide navigation while reading, reveal on upward intent.
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 24) {
        setHeaderHidden(false);
        setInteractionReveal(false);
      } else if (delta > 8 && !menuOpen && !searchOpen) {
        setHeaderHidden(true);
        setInteractionReveal(false);
        setActiveSub(null);
      } else if (delta < -8) {
        setHeaderHidden(false);
      }

      lastScrollY = Math.max(currentScrollY, 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen, searchOpen]);

  const isHeaderHidden =
    headerHidden && !menuOpen && !searchOpen && !interactionReveal;

  return (
    <>
      {isHeaderHidden && (
        <button
          type="button"
          className="hidden-menu-handle"
          aria-label="Reveal navigation"
          onClick={revealHeader}
          onPointerEnter={revealHeader}
          onFocus={revealHeader}
        />
      )}
      <header
        className="invisible-site-header"
        data-hidden={isHeaderHidden ? "true" : "false"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "#fff",
          color: "#111",
          borderBottom: "1px solid #ddd",
          fontFamily: "var(--font-sans)",
        }}
        role="banner"
        onPointerEnter={revealHeader}
        onPointerLeave={releaseHeader}
        onFocusCapture={revealHeader}
        onBlurCapture={releaseHeader}
      >
      <div
        style={{
          height: 80,
          maxWidth: 1440,
          margin: "auto",
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          gap: menuOpen ? 40 : 0,
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
            marginRight: menuOpen ? 0 : "auto",
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

        {/* Main Menu - Shows when menuOpen is true */}
        {menuOpen && (
          <nav
            className="mega-menu"
            style={{
              display: "flex",
              gap: 40,
              alignItems: "center",
              flex: 1,
            }}
          >
            {navItems.map((item) => (
              <div
                key={item.key}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSub(
                          activeSub === item.key ? null : item.key
                        )
                      }
                      style={{
                        border: 0,
                        background: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 16,
                        padding: 0,
                        cursor: "pointer",
                        color: "#111",
                        fontWeight: 500,
                        fontFamily: "inherit",
                      }}
                      aria-expanded={activeSub === item.key}
                    >
                      {item.label}
                      <span aria-hidden="true">+</span>
                    </button>

                    {/* Submenu */}
                    {activeSub === item.key && (
                      <div
                        style={{
                          position: "absolute",
                          top: 80,
                          left: 0,
                          width: 240,
                          background: "#fff",
                          boxShadow:
                            "0 10px 30px rgba(0, 0, 0, 0.15)",
                          padding: 20,
                          borderRadius: 4,
                        }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            style={{
                              display: "block",
                              padding: "12px 0",
                              color: "#111",
                              textDecoration: "none",
                              fontSize: 14,
                              borderBottom: "1px solid #f0f0f0",
                            }}
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      color: "#111",
                      textDecoration: "none",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Utility Navigation */}
        <nav
          aria-label="Utility navigation"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            flexShrink: 0,
            marginLeft: menuOpen ? 0 : "auto",
            gap: 0,
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
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setActiveSub(null);
            }}
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
              fontSize: 18,
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <form
          style={{
            position: "absolute",
            top: 80,
            right: 64,
            zIndex: 90,
            width: "min(520px, calc(100% - 128px))",
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
    </>
  );
}
