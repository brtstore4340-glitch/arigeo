"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Categories() {
  const categories = [
    { title: 'ยาและเวชภัณฑ์', en: 'Pharmaceuticals', tag: 'Wholesale Only', img: '/images/cat-pharm.png' },
    { title: 'เครื่องมือแพทย์', en: 'Medical Devices', tag: 'Medical Grade', img: '/images/cat-devices.png' },
    { title: 'เคมีภัณฑ์', en: 'Chemicals', tag: 'Lab & Industry', img: '/images/cat-chem.png' },
    { title: 'ผลิตภัณฑ์การเกษตร', en: 'Agriculture Products', tag: 'High Yield', img: '/images/cat-agri.png' }
  ];

  return (
    <section id="products" className="section-padding bg-arigeo-softwhite -mt-20 relative z-20">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-arigeo-black mb-4"
          >
            ผลิตภัณฑ์และโซลูชันของเรา
          </motion.h2>
          <div className="w-20 h-1 bg-arigeo-red mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden hover-lift hover-red-line border border-arigeo-border cursor-pointer relative"
            >
              <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                {cat.tag}
              </div>
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={cat.img} alt={cat.en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-arigeo-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-arigeo-black mb-1">{cat.title}</h3>
                <p className="text-sm font-semibold text-arigeo-darkgray uppercase tracking-widest mb-4">{cat.en}</p>
                <div className="flex items-center text-sm font-bold text-arigeo-red">
                  Learn more 
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
