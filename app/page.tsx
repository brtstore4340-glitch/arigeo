/**
 * ARIGEO Homepage - Design System v2026-07-28
 * Rebuilding from ARIGEO Design System specification
 *
 * Component order (per design system):
 * 1. HeroShowreel - Radial wipe animation
 * 2. HomeIntroStatement - Eyebrow + title + line
 * 3. LatestCarousel - 3-up carousel (cross-links)
 * 4. NewsSection - Newsroom carousel
 * 5. PurposeSection - Kao-style 2×2 grid + 1 full-width dark card
 * 6. HomeRelatedContents - 3-card cross-link grid
 * 7. NewsletterSection - Email subscribe
 */

import HeroShowreel from "@/components/home/HeroShowreel";
import HomeIntroStatement from "@/components/home/HomeIntroStatement";
import LatestCarousel from "@/components/home/LatestCarousel";
import NewsSection from "@/components/home/NewsSection";
import PurposeSection from "@/components/home/PurposeSection";
import BrandCarouselSection from "@/components/home/BrandCarouselSection";
import HomeRelatedContents from "@/components/home/HomeRelatedContents";
import SocialProofSection from "@/components/home/SocialProofSection";
import NewsReleaseSection from "@/components/home/NewsReleaseSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      {/* 1. Full-bleed hero with radial wipe animation */}
      <HeroShowreel />

      {/* 2. Eyebrow + purpose headline + supporting line */}
      <HomeIntroStatement />

      {/* 3. Latest carousel (cross-links) */}
      <LatestCarousel heading="Latest" />

      {/* 4. News carousel */}
      <NewsSection />

      {/* 5. Kao-style Purpose grid (2×2 cards + 1 full-width dark) */}
      <PurposeSection />

      {/* 6. Brand Showcase */}
      <BrandCarouselSection />

      {/* 7. Related content 3-card grid */}
      <HomeRelatedContents />

      {/* 8. Social Proof & Awards */}
      <SocialProofSection />

      {/* 9. News & Press Releases */}
      <NewsReleaseSection />
    </main>
  );
}
