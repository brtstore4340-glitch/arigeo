'use client';

import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';
import { useState } from 'react';

interface Props {
  params: { locale: string };
}

export default function ContactPage({ params }: Props) {
  const locale = (params.locale === 'th' ? 'th' : 'en') as Locale;
  const trans = translations[locale];
  const contact = trans.contact;
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    try {
      // Validate required fields
      if (!formState.name || !formState.email || !formState.message) {
        setError(true);
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email)) {
        setError(true);
        return;
      }

      // Simulate form submission
      console.log('Form submitted:', formState);
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(true);
    }
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ORRY Thailand',
    description: 'Natural Lip Care',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bangkok',
      addressLocality: 'Bangkok',
      addressCountry: 'TH',
    },
    telephone: '+66-81-456-7890',
    email: 'hello@orry.co.th',
    url: 'https://orry.co.th',
    sameAs: [
      'https://instagram.com/orrythailand',
      'https://facebook.com/orrythailand',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
            {contact.title}
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-light)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {contact.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
            }}
          >
            {/* Contact Form */}
            <div
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.1s both',
              }}
            >
              <h2
                style={{
                  color: 'var(--color-burgundy)',
                  marginBottom: '2rem',
                  fontSize: '1.5rem',
                }}
              >
                {locale === 'en' ? 'Send us a Message' : 'ส่งข้อความถึงเรา'}
              </h2>

              {submitted && (
                <div
                  style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                    border: '1px solid #4caf50',
                  }}
                >
                  {contact.form.success}
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                    border: '1px solid #f44336',
                  }}
                >
                  {locale === 'en' ? 'Please fill all required fields correctly.' : 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมดอย่างถูกต้อง'}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                    }}
                  >
                    {contact.form.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder={contact.form.name}
                    required
                    style={{
                      minHeight: '44px',
                    }}
                    aria-label={contact.form.name}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                    }}
                  >
                    {contact.form.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder={contact.form.email}
                    required
                    style={{
                      minHeight: '44px',
                    }}
                    aria-label={contact.form.email}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                    }}
                  >
                    {contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder={contact.form.phone}
                    style={{
                      minHeight: '44px',
                    }}
                    aria-label={contact.form.phone}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                    }}
                  >
                    {contact.form.message} *
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder={contact.form.message}
                    required
                    style={{
                      minHeight: '120px',
                    }}
                    aria-label={contact.form.message}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    fontSize: '1rem',
                  }}
                >
                  {contact.form.submit}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
            >
              <h2
                style={{
                  color: 'var(--color-burgundy)',
                  marginBottom: '2rem',
                  fontSize: '1.5rem',
                }}
              >
                {contact.contact_info}
              </h2>

              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  {contact.email}
                </h3>
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-text)',
                  }}
                >
                  <a href="mailto:hello@orry.co.th">hello@orry.co.th</a>
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  {contact.phone}
                </h3>
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-text)',
                  }}
                >
                  <a href="tel:+66814567890">+66 (81) 456-7890</a>
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  {contact.location}
                </h3>
                <p
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-text)',
                  }}
                >
                  {contact.location_value}
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  {contact.hours}
                </h3>
                <p
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-text)',
                  }}
                >
                  {contact.hours_value}
                </p>
              </div>

              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <h3
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.95rem',
                    marginBottom: '1rem',
                    fontWeight: '600',
                  }}
                >
                  {contact.follow_us}
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a
                    href="https://instagram.com/orrythailand"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'var(--color-burgundy)',
                      color: 'white',
                      fontSize: '1.5rem',
                    }}
                    aria-label="Instagram"
                  >
                    📷
                  </a>
                  <a
                    href="https://facebook.com/orrythailand"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'var(--color-burgundy)',
                      color: 'white',
                      fontSize: '1.5rem',
                    }}
                    aria-label="Facebook"
                  >
                    f
                  </a>
                  <a
                    href="https://wa.me/66814567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'var(--color-burgundy)',
                      color: 'white',
                      fontSize: '1.5rem',
                    }}
                    aria-label="WhatsApp"
                  >
                    💬
                  </a>
                </div>
              </div>
            </div>
          </div>
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
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
