"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";

type Slide = {
  headline: [string, string];   // two lines
  subline: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  imageDesktop: string;
  imageMobile: string;
  imageAlt: string;
};

const SLIDES: Slide[] = [
  {
    headline: ["Elevating", "Everyday Life"],
    subline: "Innovation you can feel at home.",
    body: "ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care.",
    primary: { label: "Our Products", href: "/products" },
    secondary: { label: "About ARIGEO", href: "/about" },
    imageDesktop: "/images/hero-products-desktop.png",
    imageMobile: "/images/hero-products-mobile.png",
    imageAlt: "ARIGEO household and skincare product lineup",
  },
  {
    headline: ["Care for", "Every Home"],
    subline: "Smart household solutions.",
    body: "Cleaning and living essentials designed for a safe, comfortable home for everyone.",
    primary: { label: "Explore Household", href: "/products/household" },
    secondary: { label: "Our Approach", href: "/innovation" },
    imageDesktop: "/images/hero-household-desktop.png",
    imageMobile: "/images/hero-household-mobile.png",
    imageAlt: "ARIGEO household products in a bright living room",
  },
  {
    headline: ["Skin First,", "Every Day"],
    subline: "Thoughtfully formulated skincare.",
    body: "Gentle, effective formulas for healthy, beautiful skin — developed with high standards of safety and quality.",
    primary: { label: "Explore Skincare", href: "/products/skincare" },
    secondary: { label: "Quality Promise", href: "/innovation/quality-assurance" },
    imageDesktop: "/images/hero-skincare-desktop.png",
    imageMobile: "/images/hero-skincare-mobile.png",
    imageAlt: "ARIGEO skincare product lineup",
  },
];

const AUTO_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="ARIGEO highlights"
    >
      {/* Red circle — deliberate bleed off top-right */}
      <div
        aria-hidden
        className="absolute -top-[12%] -right-[8%] aspect-square w-[52vw] max-w-[640px] rounded-full bg-[var(--color-brand-red)]
                   max-md:-top-[6%] max-md:-right-[24%] max-md:w-[80vw]"
      />

      <div
        key={index}
        className="relative mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-10 px-[var(--container-pad)] py-[var(--space-16)] md:grid-cols-2 md:py-[var(--space-24)]
                   motion-safe:animate-[fadeIn_400ms_var(--ease-out)]"
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${SLIDES.length}`}
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-[length:var(--text-display)] font-bold leading-[var(--leading-tight)] text-[var(--color-ink)]">
            {slide.headline[0]}
            <br />
            {slide.headline[1]}
            <span className="mt-2 block text-[length:var(--text-h2)] font-semibold text-[var(--color-brand-red)]">
              {slide.subline}
            </span>
          </h1>
          <p className="max-w-[42ch] text-[var(--text-body)] leading-[var(--leading-normal)] text-[var(--color-ink-soft)]">
            {slide.body}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={slide.primary.href}>{slide.primary.label}</Button>
            <Button href={slide.secondary.href} variant="secondary">{slide.secondary.label}</Button>
          </div>
        </div>

        <div className="relative">
          <picture>
            <source media="(max-width: 767px)" srcSet={slide.imageMobile} />
            <Image
              src={slide.imageDesktop}
              alt={slide.imageAlt}
              width={720}
              height={560}
              priority={index === 0}
              className="relative z-10 h-auto w-full"
            />
          </picture>
        </div>
      </div>

      {/* Dot controls */}
      <div className="relative mx-auto flex max-w-[var(--container-max)] gap-2 px-[var(--container-pad)] pb-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.imageDesktop}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-[var(--duration-base)]
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-red)]
                        ${i === index ? "w-8 bg-[var(--color-brand-red)]" : "w-4 bg-[var(--color-line)] hover:bg-[var(--color-ink-muted)]"}`}
          />
        ))}
      </div>
    </section>
  );
}
