import Link from 'next/link';

export default function WorkPage() {
  const caseStudies = [
    { slug: 'orry-thailand', name: 'ORRY Thailand', industry: 'E-commerce & Beauty', description: 'Transforming e-commerce operations through workflow automation' },
    { slug: 'arigeo', name: 'Arigeo', industry: 'Geographic Data', description: 'Building intelligent analytics platform for better insights' },
    { slug: 'cation-maid', name: 'Cation Maid', industry: 'Cleaning Services', description: 'Scaling operations nationwide with centralized systems' },
  ];

  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-warm) 100%)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>Our Work</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            See how we've helped organizations transform their operations through digital innovation.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid grid-1" style={{ gap: 'var(--space-12)' }}>
            {caseStudies.map((study) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`}>
                <div style={{ padding: 'var(--space-12)', border: '1px solid var(--color-border)', borderRadius: 'var(--card-radius)', cursor: 'pointer', transition: 'all var(--duration-normal) var(--ease-out)' }} onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'var(--shadow-lg)'; el.style.transform = 'translateY(-8px)'; }} onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
                    {study.industry}
                  </p>
                  <h2 style={{ marginBottom: 'var(--space-4)' }}>{study.name}</h2>
                  <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
                    {study.description}
                  </p>
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                      Read case study →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-black-soft)', color: 'var(--color-white)', textAlign: 'center', paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Ready to start your transformation?</h2>
          <Link href="/discovery">
            <button className="btn-primary">Book a Discovery Session</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
