'use client';

import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';
import { useState } from 'react';

interface Props {
  params: { locale: string };
}

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

export default function FAQPage({ params }: Props) {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];
  const faq = trans.faq;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredQuestions = faq.questions.filter((q: FAQItem) => {
    const matchesSearch =
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map((q: FAQItem) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.a,
      },
    })),
  };

  const categoryList = Object.entries(faq.categories).map(([key, value]) => ({
    id: key,
    label: value,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            {faq.title}
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-light)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {faq.subtitle}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="section-padding" style={{ paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.1s both',
            }}
          >
            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder={faq.search_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  minHeight: '44px',
                }}
                aria-label="Search FAQs"
              />
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: !selectedCategory ? 'var(--color-burgundy)' : 'var(--color-cream)',
                    color: !selectedCategory ? 'white' : 'var(--color-text)',
                    border: '1px solid var(--color-burgundy)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    minHeight: '36px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {locale === 'en' ? 'All' : 'ทั้งหมด'}
                </button>

                {categoryList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: selectedCategory === cat.id ? 'var(--color-burgundy)' : 'var(--color-cream)',
                      color: selectedCategory === cat.id ? 'white' : 'var(--color-text)',
                      border: '1px solid var(--color-burgundy)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      minHeight: '36px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          {filteredQuestions.length > 0 ? (
            <div>
              {filteredQuestions.map((item: FAQItem, index: number) => (
                <div
                  key={index}
                  className="accordion-item"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${0.1 + index * 0.05}s both`,
                  }}
                >
                  <div
                    className="accordion-header"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpandedIndex(expandedIndex === index ? null : index);
                      }
                    }}
                    aria-expanded={expandedIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    style={{
                      cursor: 'pointer',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: '600' }}>
                      {item.q}
                    </span>
                    <span
                      className="accordion-toggle"
                      style={{
                        marginLeft: '1rem',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </div>

                  {expandedIndex === index && (
                    <div
                      id={`faq-answer-${index}`}
                      className="accordion-content"
                      style={{
                        animation: 'fadeIn 0.3s ease-out',
                      }}
                    >
                      <p style={{ lineHeight: '1.7' }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                {locale === 'en' ? 'No FAQs found matching your search.' : 'ไม่พบ FAQs ที่ตรงกับการค้นหาของคุณ'}
              </p>
            </div>
          )}
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
            {locale === 'en' ? "Didn't find your answer?" : 'ไม่พบคำตอบของคุณ?'}
          </h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            {locale === 'en'
              ? 'Reach out to our customer service team.'
              : 'ติดต่อทีมบริการลูกค้าของเรา'}
          </p>
          <Link href={`/${locale}/contact`}>
            <button
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-burgundy)',
                fontSize: '1rem',
              }}
              className="btn-secondary"
            >
              {trans.nav.contact}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.75rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .accordion-header {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}
