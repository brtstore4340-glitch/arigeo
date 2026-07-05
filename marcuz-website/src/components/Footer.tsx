import Link from 'next/link';
import { content } from '@/lib/content';

export function Footer() {
  const { footer } = content;

  return (
    <footer
      style={{
        background: 'var(--color-black-soft)',
        color: 'var(--color-white)',
        paddingTop: 'var(--spacing-3xl)',
        paddingBottom: 'var(--spacing-2xl)',
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-16)',
          }}
        >
          {/* Brand */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Marcuz</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 'var(--line-height-relaxed)' }}>
              {footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Company</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {footer.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'var(--font-size-sm)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Legal</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {footer.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'var(--font-size-sm)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 'var(--space-8)',
          }}
        >
          {/* Contact Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-8)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-16)', fontSize: 'var(--font-size-sm)' }}>
              <a href={`mailto:${footer.contact.email}`} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {footer.contact.email}
              </a>
              <a href={`tel:${footer.contact.phone}`} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {footer.contact.phone}
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'rgba(255, 255, 255, 0.5)' }}>
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
