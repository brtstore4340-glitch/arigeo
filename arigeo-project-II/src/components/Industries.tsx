"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Industries() {
  const industries = [
    { title: 'Hospitals & Clinics', img: '/images/ind-hospital.png' },
    { title: 'Pharmacies', img: '/images/ind-pharmacy.png' },
    { title: 'Laboratories', img: '/images/ind-lab.png' },
    { title: 'Agricultural Businesses', img: '/images/ind-agri.png' },
    { title: 'Government & Institutions', img: '/images/ind-gov.png' }
  ];

  return (
    <section id="industries" className="py-24 bg-arigeo-softwhite">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-arigeo-black mb-4"
          >
            อุตสาหกรรมที่เราให้บริการ
          </motion.h2>
          <div className="w-20 h-1 bg-arigeo-red mx-auto"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {industries.map((ind, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-64 rounded-2xl overflow-hidden group shadow-lg"
            >
              <img src={ind.img} alt={ind.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-arigeo-black/90 via-arigeo-black/40 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{ind.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
