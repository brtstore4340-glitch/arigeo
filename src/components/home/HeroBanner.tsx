"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import Media from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import styles from "./hero-banner.module.css";

export type HeroSlide = {
  src: string;
  alt: string;
  headline0: string;
  headline1: string;
  body: string;
  ctaHref: string;
  ctaText: string;
};

type Props = {
  slides?: HeroSlide[];
  autoplayInterval?: number;
};

const defaultSlides = {
  th: [
    {
      src: "/images/lifestyle/family-kitchen-1.png",
      alt: "ARIGEO ครอบครัวที่มีความสุข",
      headline0: "มอบชีวิต",
      headline1: "ที่สดใสสวยงาม",
      body: "ผลิตภัณฑ์ที่ดีที่สุดสำหรับแต่ละช่วงวันของคุณ",
      ctaHref: "/products",
      ctaText: "สำรวจผลิตภัณฑ์",
    },
    {
      src: "/images/lifestyle/wellness-fitness-1.png",
      alt: "ARIGEO ครอบครัวออกกำลังกาย",
      headline0: "สุขภาพ",
      headline1: "และความสุข",
      body: "ผลิตภัณฑ์สุขภาพสำหรับไลฟ์สไตล์ที่ใช้งานจริง",
      ctaHref: "/products",
      ctaText: "สำรวจผลิตภัณฑ์",
    },
    {
      src: "/images/products/beauty-skincare-1.png",
      alt: "ARIGEO บริหารความสวยงาม",
      headline0: "ดูแลผิว",
      headline1: "ด้วยนวัตกรรม",
      body: "สกินแคร์ที่พัฒนาจากการวิจัยอย่างลึกซึ้ง",
      ctaHref: "/products",
      ctaText: "สำรวจแบรนด์",
    },
    {
      src: "/images/team/team-culture-1.png",
      alt: "ARIGEO ทีมที่มีพลัง",
      headline0: "เติบโตอย่าง",
      headline1: "มีความรับผิดชอบ",
      body: "ความยั่งยืนเป็นส่วนหนึ่งของการกำหนดเป้าหมายของเรา",
      ctaHref: "/about",
      ctaText: "รู้จักเรา",
    },
  ],
  en: [
    {
      src: "/images/lifestyle/family-kitchen-1.png",
      alt: "ARIGEO Happy family",
      headline0: "Making life",
      headline1: "beautiful every day",
      body: "High-quality products for every moment of your day",
      ctaHref: "/products",
      ctaText: "Explore products",
    },
    {
      src: "/images/lifestyle/wellness-fitness-1.png",
      alt: "ARIGEO Active family",
      headline0: "Health and",
      headline1: "happiness",
      body: "Wellness products for a life that's truly lived",
      ctaHref: "/products",
      ctaText: "Explore products",
    },
    {
      src: "/images/products/beauty-skincare-1.png",
      alt: "ARIGEO Beautiful skin",
      headline0: "Beautiful skin",
      headline1: "through innovation",
      body: "Skincare developed through deep research and science",
      ctaHref: "/products",
      ctaText: "Explore brands",
    },
    {
      src: "/images/team/team-culture-1.png",
      alt: "ARIGEO Team commitment",
      headline0: "Growing with",
      headline1: "responsibility",
      body: "Sustainability is core to how we do business",
      ctaHref: "/about",
      ctaText: "Learn more",
    },
  ],
} as const;

export default function HeroBanner({ slides, autoplayInterval = 8000 }: Props) {
  const locale = useLocale() as "en" | "th";
  const content = slides ?? defaultSlides[locale];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide((index + content.length) % content.length);
  }, [content.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (!isPlaying || !inView || content.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, inView, content.length, nextSlide, autoplayInterval]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const slide = content[currentSlide];

  return (
    <section
      ref={containerRef}
      className={styles.hero}
      aria-label="Hero banner carousel"
    >
      <div className={styles.viewport}>
        {content.map((s, idx) => (
          <div
            key={idx}
            className={`${styles.slide} ${idx === currentSlide ? styles.active : ""}`}
            aria-hidden={idx !== currentSlide}
          >
            <Media
              src={s.src}
              alt={s.alt}
              ratio="16/9"
              priority={idx === 0}
              sizes="(max-width: 640px) 100vw, 100vw"
              className={styles.image}
            />
          </div>
        ))}
      </div>

      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.headline}>
            <span className={styles.line0}>{slide.headline0}</span>
            <span className={styles.line1}>{slide.headline1}</span>
          </h1>
          <p className={styles.body}>{slide.body}</p>
          <Button href={slide.ctaHref} variant="primary">
            {slide.ctaText}
          </Button>
        </div>
      </div>

      {content.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={prevSlide}
            className={styles.navButton}
            aria-label={locale === "th" ? "สไลด์ก่อนหน้า" : "Previous slide"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <ol className={styles.dots}>
            {content.map((_, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={idx === currentSlide ? styles.dotActive : styles.dot}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentSlide}
                />
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={styles.playButton}
            aria-label={isPlaying ? (locale === "th" ? "หยุดเล่น" : "Pause") : (locale === "th" ? "เล่น" : "Play")}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="7" y="5" width="3.4" height="14" />
                <rect x="13.6" y="5" width="3.4" height="14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className={styles.navButton}
            aria-label={locale === "th" ? "สไลด์ถัดไป" : "Next slide"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
