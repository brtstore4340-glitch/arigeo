import Link from 'next/link';

const caseStudies: Record<string, any> = {
  'orry-thailand': {
    client: 'ORRY Thailand',
    industry: 'E-commerce & Beauty',
    headline: 'Transforming E-commerce Operations',
    challenge: 'ORRY faced operational challenges scaling their e-commerce presence.',
    solution: 'We redesigned their order management, inventory, and customer workflows.',
    results: ['40% reduction in processing time', '60% inventory improvement', '3x faster response'],
  },
  'arigeo': {
    client: 'Arigeo',
    industry: 'Geographic Data',
    headline: 'Building Intelligent Analytics',
    challenge: 'Manual data processing slowed decision-making.',
    solution: 'Implemented automated data pipeline and real-time analytics.',
    results: ['80% reduction in reporting time', 'Real-time visibility', 'Better decisions'],
  },
  'cation-maid': {
    client: 'Cation Maid',
    industry: 'Cleaning Services',
    headline: 'Scaling Operations Nationwide',
    challenge: 'Manual scheduling across multiple locations.',
    solution: 'Deployed centralized scheduling and automation.',
    results: ['50% scheduling efficiency', 'Reduced overhead', 'Rapid expansion enabled'],
  },
};

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudies[params.slug];

  if (!study) {
    return (
      <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
        <h1>Case Study Not Found</h1>
        <Link href="/work">
          <button className="btn-primary">View All Work</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', background: 'linear-gradient(135deg, var(--color-blue-light) 0%, var(--color-white) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px' }}>
            <p style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
              {study.industry}
            </p>
            <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>
              {study.headline}
            </h1>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
              {study.challenge}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Our Approach</h2>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-12)' }}>
            {study.solution}
          </p>

          <h2 style={{ marginBottom: 'var(--space-6)' }}>Results</h2>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-12)' }}>
            {study.results.map((result: string, idx: number) => (
              <li key={idx} style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--color-gray-warm)', borderLeft: '4px solid var(--color-primary)' }}>
                ✓ {result}
              </li>
            ))}
          </ul>

          <Link href="/discovery">
            <button className="btn-primary">Start Your Transformation</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
