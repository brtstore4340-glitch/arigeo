"use client";

import { useTranslations } from "next-intl";

type BottleProps = {
  className?: string;
  label: string;
  sub: string;
  volume: string;
  pump?: boolean;
  clear?: boolean;
};

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Bottle({ className = '', label, sub, volume, pump = true, clear = false }: BottleProps) {
  return (
    <div className={`bottle ${clear ? 'bottle-clear' : ''} ${className}`}>
      {pump ? (
        <div className="pump">
          <span className="pump-top" />
          <span className="pump-neck" />
        </div>
      ) : (
        <div className="jar-cap" />
      )}
      <div className="bottle-body">
        <div className="mini-brand">ARIGE<i /></div>
        <strong>{label}</strong>
        <small>{sub}</small>
        <em>{volume}</em>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const t = useTranslations("Hero");

  return (
    <section className="hero">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t("slide1.subline")}</p>
          <h1>
            {t("slide1.headline0")}
            <br />
            {t("slide1.headline1")}
            <br />
            <span className="text-[var(--red)]">{t("slide1.subline")}</span>
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

        {/* Pure CSS Visual Illustration Artwork — This is the masterpiece mockup reference! */}
        <div className="hero-art" aria-label="ARIGEO product collection">
          <div className="red-orb" />
          <div className="soft-shadow" />
          <div className="product-stage">
            <Bottle className="spray-bottle" label="SURFACE CLEANER" sub="POWERFUL & GENTLE" volume="500 ml" />
            <Bottle className="clear-bottle" label="HAND WASH" sub="GENTLE CARE" volume="400 ml" clear />
            <Bottle className="lotion-bottle" label="BODY LOTION" sub="DAILY MOISTURE" volume="300 ml" />
            <Bottle className="cream-jar" label="MOISTURE CREAM" sub="50 g" volume="" pump={false} />
          </div>
          <div className="plant">
            <span className="stem stem-a" />
            <span className="stem stem-b" />
            <i className="leaf l1" />
            <i className="leaf l2" />
            <i className="leaf l3" />
            <i className="leaf l4" />
            <i className="leaf l5" />
          </div>
          <div className="towels">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
