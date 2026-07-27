"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Media from "@/components/ui/Media";
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
      src: "/images/hero/showReel01.jpg",
      alt: "ARIGEO Kirei lifestyle 1",
      headline0: "มอบชีวิต",
      headline1: "ที่สดใสสวยงาม",
      body: "ผลิตภัณฑ์ที่ดีที่สุดสำหรับแต่ละช่วงวันของคุณ",
      ctaHref: "/th/about",
      ctaText: "รู้จักเรา",
    },
    {
      src: "/images/hero/showReel02.jpg",
      alt: "ARIGEO household products",
      headline0: "บ้านสะอาด",
      headline1: "ชีวิตดีขึ้น",
      body: "ผลิตภัณฑ์บ้านคุณภาพสูงเพื่อวันทำการสะอาด",
      ctaHref: "/th/products",
      ctaText: "สำรวจผลิตภัณฑ์",
    },
    {
      src: "/images/hero/showReel03.jpg",
      alt: "ARIGEO skincare innovation",
      headline0: "ดูแลผิว",
      headline1: "ด้วยนวัตกรรม",
      body: "สกินแคร์ที่พัฒนาจากการวิจัยอย่างลึกซึ้ง",
      ctaHref: "/th/brands",
      ctaText: "สำรวจแบรนด์",
    },
    {
      src: "/images/hero/showReel04.jpg",
      alt: "ARIGEO sustainability commitment",
      headline0: "เติบโตอย่าง",
      headline1: "มีความรับผิดชอบ",
      body: "ความยั่งยืนเป็นส่วนหนึ่งของการกำหนดเป้าหมายของเรา",
      ctaHref: "/th/sustainability",
      ctaText: "เรียนรู้เพิ่มเติม",
    },
  ],
  en: [
    {
      src: "/images/hero/showReel01.jpg",
      alt: "ARIGEO Kirei lifestyle 1",
      headline0: "Making life",
      headline1: "beautiful every day",
      body: "High-quality products for every moment of your day",
      ctaHref: "/en/about",
      ctaText: "Get to know us",
    },
    {
      src: "/images/hero/showReel02.jpg",
      alt: "ARIGEO household products",
      headline0: "A clean home",
      headline1: "a better life",
      body: "Premium household products for effortless cleanliness",
      ctaHref: "/en/products",
      ctaText: "Explore products",
    },
    {
      src: "/images/hero/showReel03.jpg",
      alt: "ARIGEO skincare innovation",
      headline0: "Beautiful skin",
      headline1: "through innovation",
      body: "Skincare developed through deep research and technology",
      ctaHref: "/en/brands",
      ctaText: "Explore brands",
    },
    {
      src: "/images/hero/showReel04.jpg",
      alt: "ARIGEO sustainability commitment",
      headline0: "Growing with",
      headline1: "responsibility",
      body: "Sustainability is core to how we do business",
      ctaHref: "/en/sustainability",
      ctaText: "Learn more",
    },
  ],
} as const;

export default function HeroBanner({ slides, autoplayInterval = 8000 }: Props) {
  const locale = useLocale() === "th" ? "th" : "en";
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
          <Link href={slide.ctaHref} className={styles.cta}>
            {slide.ctaText}
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
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
