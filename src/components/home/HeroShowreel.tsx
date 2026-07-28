"use client";

/**
 * HeroShowreel
 * Full-bleed cinematic hero with radial "wipe" photo crossfade + staggered tagline reveal
 *
 * Design System Spec:
 * - Radial wipe clip-path: circle(0% → 150% at 50% 100%), 2200ms, cubic-bezier(0.16,1,0.3,1)
 * - 6 lifestyle photos rotating
 * - Tagline reveals line-by-line with stagger
 * - Fixed copy: "We don't follow categories. We create them." → links to /about#core-values
 */

export default function HeroShowreel() {
  return (
    <section className="hero-showreel" style={{
      backgroundImage: 'url(/images/home/hero-lifestyle-family-household.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="hero-overlay">
        <h1>We don't follow categories. We create them.</h1>
        <a href="/about#core-values">Our core value</a>
      </div>
    </section>
  );
}
