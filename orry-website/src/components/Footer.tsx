'use client';

import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const trans = translations[locale];
  const footer = trans.footer;

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-burgundy)',
        color: 'white',
        marginTop: '4rem',
        padding: '3rem 0 1rem',
      }}
    >
      <div className="container">
        <div
          className="grid-3"
          style={{
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Company Info */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>ORRY</h4>
            <p>{footer.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href={`/${locale}`} style={{ color: 'white' }}>
                  {trans.nav.home}
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href={`/${locale}/about`} style={{ color: 'white' }}>
                  {footer.about_us}
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href={`/${locale}/contact`} style={{ color: 'white' }}>
                  {footer.contact_us}
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href={`/${locale}/faq`} style={{ color: 'white' }}>
                  {trans.nav.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Policies</h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'white' }}>
                  {footer.privacy}
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'white' }}>
                  {footer.terms}
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'white' }}>
                  {footer.shipping}
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'white' }}>
                  {footer.returns}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h4 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://instagram.com" style={{ color: 'white', fontSize: '1.5rem' }}>
              📷
            </a>
            <a href="https://facebook.com" style={{ color: 'white', fontSize: '1.5rem' }}>
              f
            </a>
            <a href="https://tiktok.com" style={{ color: 'white', fontSize: '1.5rem' }}>
              🎵
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
