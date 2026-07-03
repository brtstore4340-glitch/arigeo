'use client';

import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';
import { useState } from 'react';

interface Props {
  params: { locale: string };
}

interface Testimonial {
  name: string;
  rating: number;
  text: string;
}

export default function ReviewsPage({ params }: Props) {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];
  const reviews = trans.reviews;
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  // Show cards on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(Array(reviews.testimonials.length).fill(true));
    }, 100);
    return () => clearTimeout(timer);
  }, [reviews.testimonials.length]);

  // Calculate average rating
  const avgRating = 
    reviews.testimonials.reduce((sum: number, t: Testimonial) => sum + t.rating, 0) / 
    reviews.testimonials.length;

  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: avgRating.toFixed(1),
    bestRating: '5',
    worstRating: '1',
    ratingCount: reviews.testimonials.length,
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="star" style={{ color: i < rating ? 'var(--color-gold)' : 'var(--color-border)' }}>
        ★
      </span>
    ));
  };

  const trustBadges = [
    {
      icon: '✓',
      label: locale === 'en' ? '100% Natural' : '100% ธรรมชาติ',
    },
    {
      icon: '🌱',
      label: locale === 'en' ? 'Eco-Friendly' : 'ปลอดภัยต่อสิ่งแวดล้อม',
    },
    {
      icon: '🔬',
      label: locale === 'en' ? 'Dermatologist Tested' : 'ทดสอบโดยผู้เชี่ยวชาญ',
    },
    {
      icon: '🌟',
      label: locale === 'en' ? 'Cruelty-Free' : 'ปลอดการทดลองสัตว์',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />

      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '4rem 1rem',
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out',
        }}
      >
        <div className="container">
          <h1 style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
            {reviews.title}
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-light)',
              maxWidth: '600px',
              margin: '0 auto 1.5rem',
            }}
          >
            {reviews.subtitle}
          </p>

          {/* Average Rating Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              animation: 'fadeInUp 0.8s ease-out 0.1s both',
            }}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-burgundy)' }}>
              {avgRating.toFixed(1)}
            </div>
            <div>
              <div className="stars" style={{ marginBottom: '0.25rem' }}>
                {renderStars(Math.round(avgRating))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>
                {locale === 'en' 
                  ? `Based on ${reviews.testimonials.length} reviews` 
                  : `จากรีวิว ${reviews.testimonials.length} รายการ`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem',
            }}
          >
            {reviews.testimonials.map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className="card"
                style={{
                  opacity: visibleCards[index] ? 1 : 0,
                  transform: visibleCards[index] ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${index * 0.1}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '280px',
                }}
              >
                {/* Stars */}
                <div style={{ marginBottom: '1rem' }}>
                  <div className="stars">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    flex: 1,
                    marginBottom: '1.5rem',
                    fontStyle: 'italic',
                    color: 'var(--color-text-light)',
                  }}
                >
                  "{testimonial.text}"
                </p>

                {/* Customer Name */}
                <div
                  style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, var(--color-burgundy), var(--color-gold))`,
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <p
                    style={{
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      margin: 0,
                      fontSize: '0.95rem',
                    }}
                  >
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-cream) 0%, #f5f1eb 100%)`,
          padding: '4rem 1rem',
        }}
      >
        <div className="container">
          <h2
            style={{
              color: 'var(--color-burgundy)',
              marginBottom: '3rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
            }}
          >
            {reviews.trust_title}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  animation: `fadeInUp 0.8s ease-out ${0.3 + index * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                  }}
                >
                  {badge.icon}
                </div>
                <p
                  style={{
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    fontSize: '0.95rem',
                  }}
                >
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2
            style={{
              color: 'var(--color-burgundy)',
              marginBottom: '1rem',
              animation: 'fadeInUp 0.8s ease-out 0.3s both',
            }}
          >
            {reviews.cta_title}
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              animation: 'fadeInUp 0.8s ease-out 0.4s both',
            }}
          >
            {reviews.cta_subtitle}
          </p>
          <Link href={`/${locale}`} style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both', display: 'inline-block' }}>
            <button className="btn-primary" style={{ minHeight: '44px', fontSize: '1rem' }}>
              {locale === 'en' ? 'Shop Now' : 'ซื้อเลย'}
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

        .stars {
          display: inline-flex;
          gap: 0.25rem;
        }

        .star {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.75rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .card {
            min-height: auto;
          }
        }
      `}</style>
    </>
  );
}
