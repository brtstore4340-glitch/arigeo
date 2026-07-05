import Link from 'next/link';

const articles: Record<string, any> = {
  'why-systems-fail': {
    title: 'Why Scaling Systems Fail (And How to Fix It)',
    category: 'Digital Transformation',
    date: 'Jul 2, 2026',
    author: 'Marcuz Team',
    content: `Most systems that worked perfectly for 10 people break at 50. The same system breaks again at 150. And again at 500.

This isn't a failure of the original system—it's the nature of growth. The processes, tools, and workflows that enable a startup to move fast become the bottlenecks that slow down a growing organization.

The good news? This is predictable. And it's fixable.

We see this pattern repeatedly across healthcare, retail, hospitality, and professional services. The symptoms are always the same:
- Manual processes start taking up more time
- Information gets scattered across tools
- Decision-making slows down
- Knowledge lives in people's heads, not systems
- Growth becomes harder, not easier

The solution is systematic: Start with understanding your business goals. Map your actual workflows, not the ones you wish you had. Identify the bottlenecks. Then redesign—using the right combination of automation, integration, and AI.

The transformation doesn't happen all at once. It happens through deliberate, phased improvements that build on each other.

When done right, growth becomes easier again.`,
  },
  'ai-amplify-people': {
    title: 'AI Should Amplify People, Not Replace Them',
    category: 'AI & Automation',
    date: 'Jun 28, 2026',
    author: 'Marcuz Team',
    content: 'The future of work is not AI vs. humans. It\'s AI + humans working better together.',
  },
  'decisions-data': {
    title: 'Better Decisions Start With Better Data',
    category: 'Analytics',
    date: 'Jun 21, 2026',
    author: 'Marcuz Team',
    content: 'You can\'t improve what you can\'t measure. Here\'s how to build visibility into your business.',
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];

  if (!article) {
    return (
      <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
        <h1>Article Not Found</h1>
        <Link href="/insights">
          <button className="btn-primary">Back to Insights</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', background: 'linear-gradient(135deg, var(--color-blue-light) 0%, var(--color-white) 100%)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
            {article.category}
          </p>
          <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: 'var(--space-8)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span>{article.date}</span>
            <span>By {article.author}</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-primary)' }}>
            {article.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} style={{ marginBottom: 'var(--space-6)' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--space-12)', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              Ready to explore how these ideas apply to your organization?
            </p>
            <Link href="/discovery">
              <button className="btn-primary">Schedule a Discovery</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
