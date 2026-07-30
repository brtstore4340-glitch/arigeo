"use client";

import { useEffect, useRef, useState } from "react";
import Media from "@/components/ui/Media";
import styles from "./core-values-section.module.css";

export default function CoreValuesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="values-heading"
    >
      {/* Hero with Image */}
      <div className={styles.heroContainer}>
        <div className={styles.imageWrapper}>
          <Media
            src="/images/team/team-culture-1.png"
            alt="ARIGEO team - We don't follow category, We create them"
            ratio="16/9"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            className={styles.heroImage}
          />
        </div>

        {/* Overlay Content */}
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h2 id="values-heading" className={styles.heroHeadline}>
              We don't follow category
              <br />
              We create them
            </h2>
            <p className={styles.heroSubheadline}>Our Core Values</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <Media
              src="/images/lifestyle/family-kitchen-1.png"
              alt="Household - Smart solutions for a clean, safe and comfortable home"
              ratio="3/2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.cardImageImg}
            />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Household</h3>
            <p className={styles.cardDescription}>
              Smart solutions for a clean, safe and comfortable home for everyone
            </p>
            <a href="/products" className={styles.cardLink}>
              Explore Products
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardImage}>
            <Media
              src="/images/products/beauty-skincare-1.png"
              alt="Skincare - Thoughtfully formulated skincare for healthy, beautiful skin"
              ratio="3/2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.cardImageImg}
            />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Skincare</h3>
            <p className={styles.cardDescription}>
              Thoughtfully formulated skincare for healthy, beautiful skin every day
            </p>
            <a href="/products" className={styles.cardLink}>
              Explore Products
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardImage}>
            <Media
              src="/images/lifestyle/wellness-fitness-1.png"
              alt="Wellness - Quality products for healthy and sustainable living"
              ratio="3/2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.cardImageImg}
            />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Wellness</h3>
            <p className={styles.cardDescription}>
              Quality products for healthy and sustainable living for you and your family
            </p>
            <a href="/products" className={styles.cardLink}>
              Explore Products
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
