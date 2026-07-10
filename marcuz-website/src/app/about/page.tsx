import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-warm) 100%)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'var(--font-size-display-lg)', marginBottom: 'var(--space-6)' }}>About Marcuz</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
            We're a Digital Transformation Partner dedicated to helping growing organizations redesign how they work through intelligent systems, thoughtful automation, and AI-enabled workflows.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Our Mission</h2>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-12)', lineHeight: 'var(--line-height-relaxed)' }}>
            To help organizations reimagine their operations, eliminate inefficiency, and scale with intelligence. We believe technology should simplify work, not complicate it.
          </p>

          <h2 style={{ marginBottom: 'var(--space-6)' }}>How We Work</h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            We don't start with software. We start with understanding your business. We listen, we analyze, we diagnose. Then we design solutions that work for your organization's unique context.
          </p>
          <p style={{ marginBottom: 'var(--space-12)' }}>
            We believe in deep partnerships. We're not vendors—we're advisors committed to your long-term success.
          </p>

          <h2 style={{ marginBottom: 'var(--space-6)' }}>Our Values</h2>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-12)' }}>
            <li style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              <strong>Business First</strong> — Technology serves your goals, not the reverse
            </li>
            <li style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              <strong>Human-Centered</strong> — Systems should make people's jobs easier
            </li>
            <li style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              <strong>Simplicity</strong> — Elegant, not flashy. Purposeful, not complex
            </li>
            <li style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              <strong>Long-term Thinking</strong> — We build for your future, not just today
            </li>
          </ul>

          <div style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--space-12)', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              Ready to explore what's possible for your organization?
            </p>
            <Link href="/discovery">
              <button className="btn-primary">Book a Discovery Session</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
