'use client';

import { useState } from 'react';
import { content } from '@/lib/content';

export default function DiscoveryPage() {
  const { discovery } = content;
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    company: '',
    industry: '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormState({ fullName: '', email: '', company: '', industry: '', challenge: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section
        style={{
          paddingTop: 'var(--spacing-2xl)',
          paddingBottom: 'var(--spacing-2xl)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-warm) 100%)',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>
            {discovery.headline}
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            {discovery.subheading}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {submitted ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-16)',
                border: '2px solid var(--color-primary)',
                borderRadius: 'var(--card-radius)',
                background: 'var(--color-blue-light)',
              }}
            >
              <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
                ✓ Discovery session scheduled!
              </h2>
              <p style={{ marginBottom: 'var(--space-4)' }}>
                Thank you for booking a discovery session. We'll be in touch within 24 hours to confirm.
              </p>
              <button className="btn-primary" onClick={() => window.location.href = '/'}>
                Return to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
                {discovery.formTitle}
              </h2>

              {discovery.formFields.map((field) => (
                <div key={field.name} style={{ marginBottom: 'var(--space-6)' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={handleChange}
                      required={field.required}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--input-radius)',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                      }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={handleChange}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--input-radius)',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                      }}
                    >
                      <option value="">Select an industry...</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="retail">Retail</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="services">Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={handleChange}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--input-radius)',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                      }}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: 'var(--space-8)',
                }}
              >
                {loading ? 'Scheduling...' : discovery.submitButton}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
