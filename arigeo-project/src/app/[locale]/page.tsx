import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnimatedGallery from '@/components/AnimatedGallery';
import PurposeSection from '@/components/PurposeSection';
import BusinessSection from '@/components/BusinessSection';
import QualitySection from '@/components/QualitySection';
import SustainabilitySection from '@/components/SustainabilitySection';
import ProductSection from '@/components/ProductSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import NewsSection from '@/components/NewsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ARIGEO COMPANY LIMITED | ยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตร',
  description: 'บริษัท อะริเกโอ จำกัด ผู้จัดจำหน่ายยา เวชภัณฑ์ เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตร มุ่งเน้นคุณภาพ มาตรฐาน ความปลอดภัย และการเติบโตอย่างยั่งยืน',
  keywords: 'ARIGEO, อะริเกโอ, ยา, เวชภัณฑ์, เครื่องมือแพทย์, เคมีภัณฑ์, ผลิตภัณฑ์เกษตร, medical devices, pharmaceuticals, chemicals, agriculture products'
};

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Header />
      <HeroSection />
      <div className="pt-24 bg-arigeo-light">
        <AnimatedGallery />
      </div>
      <PurposeSection />
      <BusinessSection />
      <QualitySection />
      <SustainabilitySection />
      <ProductSection />
      <WhyChooseSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
