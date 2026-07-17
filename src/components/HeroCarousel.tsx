"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="hero-cta__icon">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HeroCarousel() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isThai = locale === "th";

  return (
    <section className="hero" id="hero">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1>
            {isThai ? (
              <>
                <span className="block" style={{ color: "inherit" }}>{t("slide1.headline0")}</span>
                <span className="block" style={{ color: "inherit" }}>{t("slide1.headline1")}</span>
                <span className="block text-[var(--red)]">
                  {t("slide1.accent0")}{t("slide1.accent1")}
                </span>
              </>
            ) : (
              <>
                {t("slide1.headline0")}
                <br />
                {t("slide1.headline1")}
                <br />
                <span className="text-[var(--red)]">
                  {t("slide1.accent0")}
                  <br />
                  {t("slide1.accent1")}
                </span>
              </>
            )}
          </h1>
          <p className="hero-lead">
            {t("slide1.body")}
          </p>
          <a className="primary-btn" href="#brands">
            {t("slide1.primary")} <ArrowIcon />
          </a>
          <div className="slider-dots" aria-label="Hero slides">
            <i className="active" />
            <i />
            <i />
          </div>
        </div>

        <div className="hero-art">
          <Image
            src="/images/home/hero-products.png"
            alt="ARIGEO product collection — surface cleaner, hand wash, body lotion and moisture cream"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="hero-photo"
          />
        </div>
      </div>
    </section>
  );
}
