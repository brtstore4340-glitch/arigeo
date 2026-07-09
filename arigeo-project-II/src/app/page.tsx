import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustSignals from '@/components/TrustSignals';
import Categories from '@/components/Categories';
import WhyChoose from '@/components/WhyChoose';
import Metrics from '@/components/Metrics';
import Products from '@/components/Products';
import Quality from '@/components/Quality';
import Industries from '@/components/Industries';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-arigeo-red selection:text-white">
      <Navbar />
      <Hero />
      <TrustSignals />
      <Categories />
      <WhyChoose />
      <Products />
      <Quality />
      <Metrics />
      <Industries />
      <section className="bg-arigeo-red py-24 text-center px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
          พร้อมให้ ARIGEO เป็นพันธมิตรด้านผลิตภัณฑ์คุณภาพของคุณ
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#contact" className="px-10 py-4 bg-white text-arigeo-red font-bold uppercase tracking-widest rounded-full hover:bg-arigeo-black hover:text-white transition-colors shadow-lg">
            ขอใบเสนอราคา
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
