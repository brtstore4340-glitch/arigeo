"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-arigeo-black overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img src="/images/hero.png" alt="ARIGEO Premium Products" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-arigeo-black via-arigeo-black/80 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-arigeo-softwhite to-transparent"></div>
      </div>

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-arigeo-red/30 bg-arigeo-red/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-arigeo-red animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Premium Commercial Supply</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            ยกระดับคุณภาพชีวิต ด้วยเวชภัณฑ์ที่<span className="text-arigeo-red">ได้มาตรฐานสากล</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            ARIGEO คือพันธมิตรด้านการจัดจำหน่ายยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตรแบบครบวงจร พร้อมส่งมอบสินค้าคุณภาพสูง เพื่อสุขอนามัยที่ดีและการเติบโตอย่างยั่งยืน
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a href="#contact" className="px-8 py-4 rounded-full bg-arigeo-red text-white text-center font-bold tracking-wide hover:bg-arigeo-darkred transition-colors shadow-red-soft">
              ติดต่อทีมขาย
            </a>
            <a href="#products" className="px-8 py-4 rounded-full border-2 border-white/20 text-white text-center font-bold tracking-wide hover:bg-white hover:text-arigeo-black transition-colors">
              แคตตาล็อกสินค้า
            </a>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">ค้นหาโซลูชันสำหรับอุตสาหกรรม:</p>
            <div className="flex flex-wrap gap-3">
              <a href="#industries" className="text-sm font-semibold text-white/80 hover:text-arigeo-red transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">🏥 โรงพยาบาลและคลินิก</a>
              <a href="#industries" className="text-sm font-semibold text-white/80 hover:text-arigeo-red transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">🔬 ห้องปฏิบัติการ (Lab)</a>
              <a href="#industries" className="text-sm font-semibold text-white/80 hover:text-arigeo-red transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">🌱 ภาคการเกษตร</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
