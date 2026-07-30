"use client";

import { useState, useEffect } from "react";
import styles from "./hero-showreel.module.css";

/**
 * HeroShowreel
 * Full-bleed cinematic hero with radial "wipe" photo crossfade + staggered tagline reveal
 *
 * Design System Spec:
 * - Radial wipe clip-path: circle(0% → 150% at 50% 100%), 2200ms, cubic-bezier(0.16,1,0.3,1)
 * - 6 lifestyle photos rotating (8 second cycle)
 * - Tagline reveals line-by-line with stagger
 * - Fixed copy: "We don't follow categories. We create them." → links to /about#core-values
 */

const heroImages = [
  "/images/home/hero-lifestyle-family-household.jpg",
  "/images/home/hero-lifestyle-cooking.jpg",
  "/images/home/hero-lifestyle-family-2.jpg",
  "/images/home/hero-lifestyle-innovation.jpg",
  "/images/home/hero-lifestyle-sustainability.jpg",
  "/images/home/hero-lifestyle-about-us.png",
];

export default function HeroShowreel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000); // 8 second cycle (2.2s animation + 5.8s hold)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section}>
      {/* Rotating Background Image with Radial Wipe */}
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
        }}
        key={currentImageIndex}
      />

      {/* Dark Overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.headingLine}>
            We don't follow categories.
          </span>
          <span className={styles.headingLine}>We create them.</span>
        </h1>
        <a href="/about#core-values" className={styles.cta}>
          Our core value
        </a>
      </div>
    </section>
  );
}
