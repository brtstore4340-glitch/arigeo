import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import HomeProductsSection from '@/components/HomeProductsSection';
import CategorySection from '@/components/CategorySection';
import ValuesSection from '@/components/ValuesSection';
import NewsSection from '@/components/NewsSection';
import NewsletterSection from '@/components/NewsletterSection';

export const metadata = {
  title: 'ARIGEO — Elevating Everyday Life',
  description: 'ARIGEO develops trusted household and skincare products that combine advanced innovation with safety and care—bringing quality to everyday life for everyone.',
  keywords: 'ARIGEO, household, skincare, innovation, everyday life, quality, safety'
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroCarousel />
      <HomeProductsSection />
      <CategorySection />
      <ValuesSection />
      <NewsSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
