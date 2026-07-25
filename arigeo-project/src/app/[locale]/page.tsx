import Header from '@/components/Header';
import HeroShowreel from '@/components/HeroShowreel';
import HomeIntroStatement from '@/components/HomeIntroStatement';
import LatestCarousel from '@/components/LatestCarousel';
import AnimatedGallery from '@/components/AnimatedGallery';
import PurposeSection from '@/components/PurposeSection';
import SustainabilitySection from '@/components/SustainabilitySection';
import NewsSection from '@/components/NewsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ARIGEO | Captain Maid, GenuLeaf, CeraTory',
  description: "We don't follow categories. We create them. ARIGEO brings together household care and skincare brands — Captain Maid, GenuLeaf, CeraTory — built on trust, safety and quality.",
  keywords: 'ARIGEO, Captain Maid, GenuLeaf, CeraTory, household care, skincare, cleaning products, sustainability, innovation'
};

export default async function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Header />
      <HeroShowreel />
      <HomeIntroStatement />
      <LatestCarousel />
      <div className="pt-24 bg-arigeo-light">
        <AnimatedGallery />
      </div>
      <PurposeSection />
      <SustainabilitySection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
