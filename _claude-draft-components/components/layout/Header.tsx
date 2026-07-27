"use client";

import Link from "next/link";
import { useState } from "react";
import { DotAccent } from "../ui/DotAccent";

const NAV = [
  { label: "About Us", href: "/about" },
  { label: "Our Brands", href: "/brands" },
  { label: "Products", href: "/products" },
  { label: "Innovation", href: "/innovation" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Newsroom", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
      ARIGE
      <DotAccent size="lg" className="translate-y-[2px]" />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-[var(--container-pad)]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--text-small)] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-brand-red)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full lg:hidden
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-red)]"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-[var(--color-line)] bg-white px-[var(--container-pad)] py-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[var(--text-body)] font-medium text-[var(--color-ink)]
                             border-b border-[var(--color-line)] last:border-0
                             transition-colors hover:text-[var(--color-brand-red)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
