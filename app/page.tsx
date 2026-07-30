/**
 * ARIGEO Homepage - Design System v2026-07-28
 * Rebuilding from ARIGEO Design System specification
 *
 * Component order (per design system):
 * 1. HeroShowreel - Radial wipe animation
 * 2. HomeIntroStatement - Eyebrow + title + line
 * 3. NewsSection - Newsroom carousel
 * 4. PurposeSection - Kao-style 2×2 grid + 1 full-width dark card
 * 5. BrandCarouselSection - Brand showcase
 * 6. NewsRelease - Press releases (Kao layout)
 */

import HeroShowreel from "@/components/home/HeroShowreel";
import HomeIntroStatement from "@/components/home/HomeIntroStatement";
import NewsSection from "@/components/home/NewsSection";
import PurposeSection from "@/components/home/PurposeSection";
import BrandCarouselSection from "@/components/home/BrandCarouselSection";
import NewsRelease from "@/components/home/NewsRelease";
import Footer from "@/components/home/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <main>
        {/* 1. Full-bleed hero with radial wipe animation */}
        <HeroShowreel />

        {/* 2. Eyebrow + purpose headline + supporting line */}
        <HomeIntroStatement />

        {/* 3. News carousel */}
        <NewsSection />

        {/* 5. Kao-style Purpose grid (2×2 cards + 1 full-width dark) */}
        <PurposeSection />

        {/* 6. Brand Showcase */}
        <BrandCarouselSection />

        {/* 6. News & Press Releases */}
        <NewsRelease />
      </main>

      <Footer />
    </>
  );
}
