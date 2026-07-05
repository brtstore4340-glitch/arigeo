'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Locale, translations } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const trans = translations[locale];
  const nav = trans.nav;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      style={{
        backgroundColor: 'var(--color-cream)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
          }}
        >
          {/* Logo */}
          <Link href={`/${locale}`} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span style={{ color: 'var(--color-burgundy)' }}>ORRY</span>
          </Link>

          {/* Desktop Menu */}
          <div
            style={{
              display: 'none',
              gap: '2rem',
              '@media (min-width: 768px)': {
                display: 'flex',
              },
            }}
            className="desktop-menu"
          >
            <Link href={`/${locale}`}>{nav.home}</Link>
            <Link href={`/${locale}/about`}>{nav.about}</Link>
            <Link href={`/${locale}/contact`}>{nav.contact}</Link>
            <Link href={`/${locale}/faq`}>{nav.faq}</Link>
            <Link href={`/${locale}/reviews`}>{nav.reviews}</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 0,
              display: 'none',
            }}
            className="mobile-menu-toggle"
          >
            ☰
          </button>

          {/* Locale Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href={`/en${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/[a-z]{2}/, '') : ''}`}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: locale === 'en' ? 'var(--color-burgundy)' : 'transparent',
                color: locale === 'en' ? 'white' : 'var(--color-burgundy)',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              EN
            </Link>
            <Link
              href={`/th${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/[a-z]{2}/, '') : ''}`}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: locale === 'th' ? 'var(--color-burgundy)' : 'transparent',
                color: locale === 'th' ? 'white' : 'var(--color-burgundy)',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              TH
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ paddingBottom: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <Link href={`/${locale}`} style={{ display: 'block', padding: '0.5rem 0' }}>
              {nav.home}
            </Link>
            <Link href={`/${locale}/about`} style={{ display: 'block', padding: '0.5rem 0' }}>
              {nav.about}
            </Link>
            <Link href={`/${locale}/contact`} style={{ display: 'block', padding: '0.5rem 0' }}>
              {nav.contact}
            </Link>
            <Link href={`/${locale}/faq`} style={{ display: 'block', padding: '0.5rem 0' }}>
              {nav.faq}
            </Link>
            <Link href={`/${locale}/reviews`} style={{ display: 'block', padding: '0.5rem 0' }}>
              {nav.reviews}
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
