'use client';

import Link from 'next/link';
import { content } from '@/lib/content';

export function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div className="container">
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-6) 0',
            minHeight: '64px',
          }}
        >
          {/* Logo */}
          <Link href="/">
            <span
              style={{
                fontSize: 'var(--font-size-h3)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
              }}
            >
              Marcuz
            </span>
          </Link>

          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-8)',
              alignItems: 'center',
            }}
          >
            <Link href="/" style={{ color: 'var(--color-text-primary)' }}>
              {content.nav.home}
            </Link>
            <Link href="/work" style={{ color: 'var(--color-text-primary)' }}>
              {content.nav.work}
            </Link>
            <Link href="/insights" style={{ color: 'var(--color-text-primary)' }}>
              {content.nav.insights}
            </Link>
            <Link href="/about" style={{ color: 'var(--color-text-primary)' }}>
              {content.nav.about}
            </Link>
            <button className="btn-primary">
              <Link href="/discovery" style={{ color: 'white', textDecoration: 'none' }}>
                {content.nav.contact}
              </Link>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
