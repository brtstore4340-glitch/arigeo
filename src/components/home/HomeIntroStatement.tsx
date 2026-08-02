"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  return (
    <section className="home-intro-statement">
      <span className="eyebrow">{t("hero.title")}</span>
      <h2>{t("hero.subtitle")}</h2>
      <p>ARIGEO is committed to delivering quality health, science, and household solutions that elevate everyday life.</p>
    </section>
  );
}
