"use client";
import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

// Flat hairline-bordered header — 2026-07-23 rebrand (Kao-influenced). No longer
// sticky/hide-on-scroll: a deliberate simplification, port back scroll behavior
// only if asked.
const navItems = [
  { key: 'about', label: 'About Us', href: '/about', children: [{ label: 'About ARIGEO', href: '/about' }, { label: 'Our core value', href: '/about#core-values' }] },
  { key: 'sustainability', label: 'Sustainability', href: '/sustainability', children: [{ label: 'Sustainability approach', href: '/sustainability' }, { label: 'Environment & society', href: '/sustainability' }] },
  { key: 'innovation', label: 'Innovation', href: '/innovation', children: [{ label: 'Research & development', href: '/innovation' }, { label: 'Product development', href: '/innovation' }] },
  { key: 'brands', label: 'Our Brands', href: '/brands', children: [] },
  { key: 'news', label: 'Newsroom', href: '/newsroom', children: [{ label: 'News release', href: '/newsroom' }, { label: 'ARIGEO stories', href: '/newsroom' }] },
  { key: 'careers', label: 'Careers', href: '/careers', children: [] },
];

const Header = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === 'th' ? 'en' : 'th';
  const switchLocale = () => router.replace(pathname, { locale: otherLocale });

  return (
    <header className="relative z-[70] bg-white text-arigeo-black border-b border-arigeo-line-strong font-sans">
      <div className="h-20 max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center gap-8">
        <a href="/" aria-label="ARIGEO home" className="flex items-center h-full shrink-0">
          <img src="/images/logos/arigeo-transparent.png" alt="ARIGEO logo" className="h-[72%] w-auto object-contain" />
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex flex-1 min-w-0 h-full justify-end">
          <ul className="h-full flex items-center justify-center gap-0.5 list-none m-0 p-0">
            {navItems.map((item) => {
              const open = openMenu === item.key;
              return (
                <li
                  key={item.key}
                  className="relative h-full flex"
                  onMouseEnter={() => item.children.length && setOpenMenu(item.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {item.children.length ? (
                    <button
                      type="button"
                      onClick={() => setOpenMenu(open ? null : item.key)}
                      className="h-full border-0 bg-white flex items-center gap-2 text-[17px] px-[18px] whitespace-nowrap cursor-pointer text-arigeo-black font-medium"
                    >
                      {item.label}<span aria-hidden="true">＋</span>
                    </button>
                  ) : (
                    <a href={item.href} className="h-full flex items-center text-[17px] px-[18px] whitespace-nowrap text-arigeo-black">
                      {item.label}
                    </a>
                  )}
                  {item.children.length > 0 && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[440px] p-6 bg-white border border-arigeo-line-strong shadow-[0_16px_40px_rgba(17,17,17,0.18)] transition-[opacity,transform] duration-[250ms] ease-out ${
                        open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                      }`}
                    >
                      <div className="flex justify-between pb-4 text-xl border-b border-arigeo-line-strong">
                        <a href={item.href}>{item.label}</a><span aria-hidden="true">→</span>
                      </div>
                      <ul className="list-none m-0 pt-2">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a href={c.href} className="flex justify-between py-3 px-1 border-b border-gray-100 text-arigeo-black">
                              {c.label}<span aria-hidden="true">→</span>
                            </a>
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

        {/* Utility nav */}
        <nav aria-label="Utility navigation" className="hidden lg:flex items-center h-full shrink-0">
          <button
            type="button"
            onClick={switchLocale}
            className="h-full px-[19px] flex items-center gap-2 border-0 border-l border-[#e1e1e1] bg-white text-sm font-semibold cursor-pointer text-arigeo-black"
          >
            {otherLocale.toUpperCase()}
          </button>
          <button
            type="button"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="h-full min-w-[58px] justify-center px-[19px] flex items-center border-0 border-l border-[#e1e1e1] bg-white cursor-pointer text-arigeo-black"
          >
            <Search size={18} /><span className="sr-only">Search</span>
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden ml-auto text-arigeo-black"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {searchOpen && (
        <form className="absolute top-20 right-12 z-[90] w-[min(520px,calc(100%-40px))] p-[18px] bg-white shadow-[0_12px_30px_rgba(0,0,0,.12)] flex">
          <input autoFocus placeholder="Search" className="flex-1 min-w-0 border border-gray-400 px-3.5 py-3" />
          <button type="submit" className="w-[50px] border-0 bg-arigeo-black text-white cursor-pointer flex items-center justify-center">
            <Search size={18} />
          </button>
        </form>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-arigeo-line-strong py-4 px-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-arigeo-black hover:text-arigeo-red-ink font-medium text-base py-2 border-b border-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { switchLocale(); setMobileOpen(false); }}
            className="text-left text-arigeo-black font-semibold text-sm pt-2"
          >
            Switch to {otherLocale.toUpperCase()}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
