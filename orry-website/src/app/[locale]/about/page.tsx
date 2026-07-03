'use client';

import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface Props {
  params: { locale: string };
}

export default function AboutPage({ params }: Props) {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];
  const about = trans.about;
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(Array(about.values.length).fill(true));
    }, 100);
    return () => clearTimeout(timer);
  }, [about.values.length]);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ORRY Thailand',
    description: about.subtitle,
    url: 'https://orry.co.th',
    email: 'hello@orry.co.th',
    telephone: '+66-81-456-7890',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bangkok',
      addressLocality: 'Bangkok',
      addressCountry: 'TH',
    },
    foundingDate: '2020',
    foundingLocation: 'Thailand',
    sameAs: [
      'https://instagram.com/orrythailand',
      'https://facebook.com/orrythailand',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div
            style={{
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            <h1 style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
              {about.title}
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-light)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
            }}
          >
            <h2 style={{ color: 'var(--color-burgundy)', marginBottom: '1.5rem', textAlign: 'center' }}>
              {about.story_title}
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              {about.story}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '4rem 1rem',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.3s both',
            }}
          >
            <h2 style={{ color: 'var(--color-burgundy)', marginBottom: '1.5rem' }}>
              {about.mission_title}
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              {about.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container">
          <h2
            style={{
              color: 'var(--color-burgundy)',
              marginBottom: '3rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.4s both',
            }}
          >
            {locale === 'en' ? 'Our Values' : 'ค่านิยมของเรา'}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {about.values.map((value, index) => (
              <div
                key={index}
                className="card"
                style={{
                  opacity: visibleCards[index] ? 1 : 0,
                  transform: visibleCards[index] ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${index * 0.1}s`,
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {index === 0 && '🌿'}
                  {index === 1 && '✨'}
                  {index === 2 && '🌍'}
                  {index === 3 && '👥'}
                </div>
                <h3 style={{ color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
                  {value.title}
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '4rem 1rem',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.7s both',
            }}
          >
            <h2 style={{ color: 'var(--color-burgundy)', marginBottom: '1.5rem' }}>
              {about.philosophy_title}
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              {about.philosophy}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container">
          <h2
            style={{
              color: 'var(--color-burgundy)',
              marginBottom: '3rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.5s both',
            }}
          >
            {about.team_title}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {about.team.map((member, index) => (
              <div
                key={index}
                className="card"
                style={{
                  textAlign: 'center',
                  animation: `fadeInUp 0.8s ease-out ${0.6 + index * 0.15}s both`,
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, var(--color-burgundy), var(--color-gold))`,
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white',
                  }}
                >
                  {index === 0 && '🧪'}
                  {index === 1 && '🌱'}
                  {index === 2 && '🤝'}
                </div>
                <h3 style={{ color: 'var(--color-burgundy)', marginBottom: '0.25rem' }}>
                  {member.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-gold)',
                    marginBottom: '1rem',
                    fontWeight: '600',
                  }}
                >
                  {member.role}
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  {member.bio}
                </p>
              </div>
            ))}
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
          <h2 style={{ marginBottom: '1rem' }}>
            {locale === 'en' ? 'Ready to Experience ORRY?' : 'พร้อมที่จะสัมผัส ORRY?'}
          </h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            {locale === 'en'
              ? 'Shop our collection and discover natural beauty today.'
              : 'ซื้อคอลเลกชันของเราและค้นพบความงามธรรมชาติวันนี้'}
          </p>
          <Link href={`/${locale}`}>
            <button
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-burgundy)',
                fontSize: '1rem',
              }}
              className="btn-secondary"
            >
              {trans.nav.shop}
            </button>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.75rem;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
