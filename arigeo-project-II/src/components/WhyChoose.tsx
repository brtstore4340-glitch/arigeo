"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function WhyChoose() {
  const points = [
    { title: 'สินค้าคุณภาพสูง', desc: 'คัดสรรผลิตภัณฑ์ที่ได้มาตรฐานสากล เพื่อความปลอดภัยสูงสุด' },
    { title: 'มาตรฐานและความน่าเชื่อถือ', desc: 'กระบวนการตรวจสอบคุณภาพที่เข้มงวดในทุกขั้นตอน' },
    { title: 'ระบบจัดจำหน่ายครบวงจร', desc: 'จัดการคลังสินค้าและระบบลอจิสติกส์ที่รวดเร็วและแม่นยำ' },
    { title: 'สนับสนุนทุกภาคส่วน', desc: 'ตอบโจทย์ทั้งภาคสาธารณสุข อุตสาหกรรม และเกษตรกรรม' }
  ];

  return (
    <section id="about" className="py-24 bg-arigeo-black text-white relative">
      <div className="absolute inset-0 opacity-20">
        <img src="/images/why-bg.png" alt="ARIGEO Warehouse" className="w-full h-full object-cover" />
      </div>

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold text-arigeo-red uppercase tracking-widest mb-3">Why Choose ARIGEO</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">โครงสร้างพื้นฐานระดับองค์กร ที่พร้อมสนับสนุนธุรกิจคุณ</h3>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {points.map((point, index) => (
              <div key={index} className="relative pl-6 border-l-2 border-arigeo-red">
                <h4 className="text-xl font-bold mb-2">{point.title}</h4>
                <p className="text-sm text-gray-400">{point.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-4 pt-12">
            <img src="/images/quality-lab.png" alt="Lab" className="w-full h-64 object-cover rounded-2xl" />
            <img src="/images/ind-hospital.png" alt="Hospital" className="w-full h-48 object-cover rounded-2xl" />
          </div>
          <div className="space-y-4">
            <img src="/images/ind-pharmacy.png" alt="Pharmacy" className="w-full h-48 object-cover rounded-2xl" />
            <img src="/images/ind-agri.png" alt="Agriculture" className="w-full h-64 object-cover rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
