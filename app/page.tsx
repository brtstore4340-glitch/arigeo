import HeroBanner from "@/components/home/HeroBanner";
import NewsSection from "@/components/home/NewsSection";
import PurposeSection from "@/components/home/PurposeSection";
import BrandedCardSection from "@/components/home/BrandedCardSection";
import NewsRelease from "@/components/home/NewsRelease";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      {/* Hero Section with Zoom Animation */}
      <HeroBanner />

      {/* Latest News Carousel with Staggered Animations */}
      <NewsSection />

      {/* Purpose/Mission Cards with Scroll Animations */}
      <PurposeSection />

      {/* Branded Cards with Marcusx Color Palette */}
      <BrandedCardSection />

      {/* News Release List with Image Zoom */}
      <NewsRelease />

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <p>© 2026 ARIGEO by Kao. All rights reserved.</p>
      </footer>
    </main>
  );
}
