export default function PrivacyPage() {
  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', background: 'var(--color-gray-warm)' }}>
        <div className="container">
          <h1>Privacy Policy</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginTop: 'var(--space-12)' }}>1. Introduction</h2>
          <p>Marcuz ("we", "us", "our") respects your privacy. This policy explains how we collect, use, and protect your personal data.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>2. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you complete a discovery session form or contact us. This may include your name, email, company, and inquiry details.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>3. How We Use Your Information</h2>
          <p>We use your information to respond to your inquiries, schedule discovery sessions, and improve our services. We do not share your information with third parties without your consent.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>4. Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>5. Your Rights</h2>
          <p>You have the right to access, correct, and delete your personal data. To exercise these rights, contact us at hello@marcuz.co.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>6. Contact Us</h2>
          <p>If you have questions about this privacy policy, please contact us at hello@marcuz.co.</p>
        </div>
      </section>
    </div>
  );
}
