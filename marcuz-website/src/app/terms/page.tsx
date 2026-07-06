export default function TermsPage() {
  return (
    <div>
      <section style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', background: 'var(--color-gray-warm)' }}>
        <div className="container">
          <h1>Terms of Service</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginTop: 'var(--space-12)' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by these terms of service and our privacy policy.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Marcuz's website for personal, non-commercial transitory viewing only.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>3. Disclaimer</h2>
          <p>The materials on Marcuz's website are provided on an 'as is' basis. Marcuz makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>4. Limitations</h2>
          <p>In no event shall Marcuz or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Marcuz's website.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>5. Accuracy of Materials</h2>
          <p>The materials appearing on Marcuz's website could include technical, typographical, or photographic errors. Marcuz does not warrant that any of the materials on our website are accurate, complete, or current.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>6. Links</h2>
          <p>Marcuz has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Marcuz of the site. Use of any such linked website is at the user's own risk.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>7. Modifications</h2>
          <p>Marcuz may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>8. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Marcuz operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

          <h2 style={{ marginTop: 'var(--space-12)' }}>9. Contact Us</h2>
          <p>If you have any questions about these terms of service, please contact us at hello@marcuz.co.</p>
        </div>
      </section>
    </div>
  );
}
