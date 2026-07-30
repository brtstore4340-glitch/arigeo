"use client";

/**
 * HomeIntroStatement
 * Homepage lead statement below hero
 *
 * Design System Spec:
 * - Small uppercase eyebrow
 * - Large bold purpose headline
 * - One supporting paragraph
 */

export default function HomeIntroStatement() {
  return (
    <section className="home-intro-statement">
      <span className="eyebrow">OUR MISSION</span>
      <h2>Quality care for everyday life</h2>
      <p>ARIGEO is committed to delivering quality health, science, and household solutions that elevate everyday life.</p>
    </section>
  );
}
