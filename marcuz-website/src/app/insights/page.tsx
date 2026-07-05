import Link from 'next/link';

export default function InsightsPage() {
  const articles = [
    {
      slug: 'why-systems-fail',
      title: 'Why Scaling Systems Fail (And How to Fix It)',
      category: 'Digital Transformation',
      excerpt: 'Most systems that worked perfectly for 10 people break at 50.',
      date: 'Jul 2, 2026',
      featured: true,
    },
    {
      slug: 'ai-amplify-people',
      title: 'AI Should Amplify People, Not Replace Them',
      category: 'AI & Automation',
      excerpt: 'The future of work isn\'t about AI vs. humans. It\'s about AI + humans.',
      date: 'Jun 28, 2026',
    },
    {
      slug: 'decisions-data',
      title: 'Better Decisions Start With Better Data',
      category: 'Analytics',
      excerpt: 'You can\'t improve what you can\'t measure. Here\'s how to build visibility.',
      date: 'Jun 21, 2026',
    },
  ];

  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-warm) 100%)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>Insights</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Thoughts on digital transformation, systems design, and building for scale.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {articles.map((article) => (
            <Link key={article.slug} href={`/insights/${article.slug}`}>
              <div
                style={{
                  padding: 'var(--space-12)',
                  marginBottom: 'var(--space-8)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--card-radius)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                  background: article.featured ? 'var(--color-blue-light)' : 'var(--color-white)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'var(--shadow-md)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-4)' }}>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                    {article.category}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {article.date}
                  </p>
                </div>
                <h2 style={{ marginBottom: 'var(--space-4)' }}>{article.title}</h2>
                <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
