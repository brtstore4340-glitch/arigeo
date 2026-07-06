import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 'var(--spacing-3xl)',
      }}
    >
      <h1 style={{ fontSize: 'var(--font-size-display-xl)', marginBottom: 'var(--space-6)' }}>
        404
      </h1>
      <h2 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-8)', maxWidth: '500px', color: 'var(--color-text-secondary)' }}>
        The page you're looking for doesn't exist. Let's get you back on track.
      </p>
      <Link href="/">
        <button className="btn-primary">Return Home</button>
      </Link>
    </div>
  );
}
