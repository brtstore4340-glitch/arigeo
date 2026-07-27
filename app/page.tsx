import HeroBanner from "@/components/home/HeroBanner";
import CoreValuesSection from "@/components/home/CoreValuesSection";
import NewsCarousel from "@/components/home/NewsCarousel";
import BrandsSection from "@/components/home/BrandsSection";
import PurposeSection from "@/components/home/PurposeSection";
import BrandedCardSection from "@/components/home/BrandedCardSection";
import NewsRelease from "@/components/home/NewsRelease";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      {/* Hero Section with Zoom Animation */}
      <HeroBanner />

      {/* Core Values Section with Team Photo + Category Cards */}
      <CoreValuesSection />

      {/* News Carousel with Slide Format */}
      <NewsCarousel />

      {/* Our Brands Section with Captain-Maid, Genuleaf, Ceratory */}
      <BrandsSection />

      {/* Purpose/Mission Cards with Scroll Animations */}
      <PurposeSection />

      {/* Branded Cards with Marcusx Color Palette */}
      <BrandedCardSection />

      {/* News Release List with Image Zoom */}
      <NewsRelease />
    </main>
  );
}
