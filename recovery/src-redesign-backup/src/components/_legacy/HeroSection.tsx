import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-arigeo-light">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-arigeo-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-arigeo-darkred rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="max-w-2xl animate-fade-in opacity-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-arigeo-red"></span>
              <span className="text-xs font-medium text-arigeo-gray uppercase tracking-wider">Arigeo Company Limited</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              ยกระดับคุณภาพชีวิต ด้วยเวชภัณฑ์และผลิตภัณฑ์เกษตรที่<span className="text-arigeo-red">ได้มาตรฐานสากล</span>
            </h1>
            
            <p className="text-lg text-arigeo-gray leading-relaxed mb-8 max-w-xl">
              บริษัท อะริเกโอ จำกัด (ARIGEO) คือพันธมิตรที่เชื่อถือได้ในการจัดจำหน่ายยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตรแบบครบวงจร เรามุ่งมั่นส่งมอบสินค้าคุณภาพสูง เพื่อสุขอนามัยที่ดี การดำเนินธุรกิจที่ปลอดภัย และการเติบโตอย่างยั่งยืน
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#business" className="inline-flex justify-center items-center gap-2 bg-arigeo-red hover:bg-arigeo-darkred text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                สำรวจกลุ่มธุรกิจของเรา
                <ArrowRight size={18} />
              </a>
              <a href="#contact" className="inline-flex justify-center items-center gap-2 bg-white text-arigeo-gray hover:text-arigeo-red border border-gray-200 hover:border-arigeo-red px-8 py-3.5 rounded-full font-medium transition-all shadow-sm">
                ติดต่อทีมขาย
              </a>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-up hover-lift opacity-0 stagger-2">
            {/* Hero Visual */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
              <img src="/images/domo/img-1.png" alt="Hero Image" className="w-full h-full object-cover" />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-1/4 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-50 flex items-center gap-3 animate-[bounce_3s_infinite]">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-arigeo-red">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Certified</p>
                <p className="text-xs text-gray-500">Quality Standard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
