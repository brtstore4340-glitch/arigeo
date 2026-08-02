/**
 * ARIGEO Homepage - Locale-aware version
 * Supports: /en, /th
 * Design System v2026-07-28
 *
 * Component order (per design system):
 * 1. HeroShowreel - Radial wipe animation
 * 2. HomeIntroStatement - Eyebrow + title + line
 * 3. NewsSection - Newsroom carousel
 * 4. PurposeSection - 2×2 grid + 1 full-width dark card
 * 5. BrandCarouselSection - Brand showcase
 * 6. NewsRelease - Press releases
 */

import HeroShowreel from "@/components/home/HeroShowreel";
import HomeIntroStatement from "@/components/home/HomeIntroStatement";
import NewsSection from "@/components/home/NewsSection";
import PurposeSection from "@/components/home/PurposeSection";
import BrandCarouselSection from "@/components/home/BrandCarouselSection";
import NewsRelease from "@/components/home/NewsRelease";

export const dynamic = "force-dynamic";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHome({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <>
      <main>
        {/* 1. Full-bleed hero with radial wipe animation */}
        <HeroShowreel />

        {/* 2. Eyebrow + purpose headline + supporting line */}
        <HomeIntroStatement />

        {/* 3. Newsroom carousel - Latest news/updates */}
        <NewsSection />

        {/* 4. Purpose: 2×2 grid + 1 full-width card */}
        <PurposeSection />

        {/* 5. Brand carousel - Shop brands */}
        <BrandCarouselSection />

        {/* 6. Press releases - Latest news from newsroom */}
        <NewsRelease />
      </main>
    </>
  );
}
