"use client";

/**
 * NewsletterSection
 * Newsletter subscription band
 *
 * Design System Spec:
 * - Soft gray gradient card
 * - Email input + subscribe button
 * - Inline validation, loading state, success confirmation
 */

export default function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <h2>Stay updated with ARIGEO</h2>
        <p>Get the latest on innovation, products and everyday living</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
