"use client";

import { useState, useEffect } from "react";
import styles from "./hero-showreel.module.css";

/**
 * HeroShowreel
 * Full-bleed cinematic hero with radial "wipe" photo crossfade + staggered tagline reveal
 *
 * Design System Spec:
 * - Radial wipe mask with a feathered 100px edge, 8800ms, cubic-bezier(0.25,0.6,0.35,1)
 * - 6 lifestyle photos rotating (12 second cycle), previous photo kept underneath
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
  const [imageIndexes, setImageIndexes] = useState({
    current: 0,
    previous: -1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(({ current }) => ({
        previous: current,
        current: (current + 1) % heroImages.length,
      }));
    }, 12000); // 12 second cycle (8.8s wipe + hold)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section}>
      {/* Previous photo stays fully visible underneath, so no black frame
          appears while the next photo wipes in */}
      {imageIndexes.previous >= 0 && (
        <div
          className={`${styles.backgroundImage} ${styles.prevLayer}`}
          style={{
            backgroundImage: `url(${heroImages[imageIndexes.previous]})`,
          }}
        />
      )}

      {/* Rotating Background Image with Radial Wipe */}
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${heroImages[imageIndexes.current]})`,
        }}
        key={imageIndexes.current}
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
