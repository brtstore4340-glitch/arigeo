"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Quality() {
  return (
    <section id="quality" className="py-24 bg-white relative">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img src="/images/quality-lab.png" alt="Quality Control Laboratory" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arigeo-black leading-tight mb-8">
              เราคัดสรรและจัดจำหน่ายผลิตภัณฑ์ที่ผ่านการ<span className="text-arigeo-red">ควบคุมคุณภาพ</span>
            </h2>
            <p className="text-lg text-arigeo-darkgray leading-relaxed mb-8">
              เพื่อให้ลูกค้าองค์กร โรงพยาบาล คลินิก ร้านยา และภาคการเกษตร ได้รับสินค้าที่เชื่อถือได้ ปลอดภัย และตรงตามมาตรฐานสากล
            </p>
            <a href="#contact" className="inline-block px-8 py-4 border-2 border-arigeo-black text-arigeo-black font-bold uppercase tracking-widest hover:bg-arigeo-black hover:text-white transition-colors rounded-full">
              ดูใบรับรองมาตรฐาน
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
