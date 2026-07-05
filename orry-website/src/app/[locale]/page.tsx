import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];

  return {
    title: 'ORRY Thailand - Natural Lip Care',
    description: trans.home.hero_subtitle,
    openGraph: {
      title: trans.home.hero_title,
      description: trans.home.hero_subtitle,
    },
  };
}

export default function Home({ params }: Props) {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];
  const home = trans.home;

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '6rem 1rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
            {home.hero_title}
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
            }}
          >
            {home.hero_subtitle}
          </p>
          <Link href={`/${locale}/about`}>
            <button className="btn-primary">{home.hero_cta}</button>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--color-burgundy)' }}>
            {home.products_title}
          </h2>

          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* WHISPER */}
            <div className="card">
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                ✨
              </div>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--color-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {home.featured}
              </span>
              <h3 style={{ color: 'var(--color-burgundy)' }}>{home.whisper.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                {home.whisper.description}
              </p>
              <p>{home.whisper.detail}</p>
            </div>

            {/* BREEZE */}
            <div className="card">
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #f4c4a8 0%, #f0b89a 100%)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                🌅
              </div>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--color-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {home.featured}
              </span>
              <h3 style={{ color: 'var(--color-burgundy)' }}>{home.breeze.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                {home.breeze.description}
              </p>
              <p>{home.breeze.detail}</p>
            </div>

            {/* VELVET */}
            <div className="card">
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #8B2E3F 0%, #6b1f2f 100%)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                🌹
              </div>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--color-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {home.featured}
              </span>
              <h3 style={{ color: 'var(--color-burgundy)' }}>{home.velvet.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                {home.velvet.description}
              </p>
              <p>{home.velvet.detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'var(--color-burgundy)',
          color: 'white',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>{trans.nav.shop}</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            {trans.footer.tagline}
          </p>
          <Link href={`/${locale}/about`}>
            <button
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-burgundy)',
                fontSize: '1rem',
              }}
              className="btn-secondary"
            >
              {locale === 'en' ? 'Learn More' : 'เรียนรู้เพิ่มเติม'}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
