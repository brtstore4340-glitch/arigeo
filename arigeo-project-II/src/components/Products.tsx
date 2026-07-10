"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Products() {
  const products = [
    { name: 'ARIGEO Premium Med', cat: 'Pharmaceuticals', badge: 'Medical Grade', img: '/images/prod-1.png' },
    { name: 'Clinical ThermoScan', cat: 'Medical Devices', badge: 'Quality Assured', img: '/images/prod-2.png' },
    { name: 'Industrial Solvent X', cat: 'Chemicals', badge: 'B2B Supply', img: '/images/prod-3.png' },
    { name: 'AgroBoost Fertilizer', cat: 'Agriculture', badge: 'High Yield', img: '/images/prod-4.png' }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arigeo-black mb-4">Featured Supplies</h2>
            <div className="w-20 h-1 bg-arigeo-red"></div>
          </motion.div>
          <a href="#" className="text-arigeo-black font-bold uppercase tracking-wide border-b-2 border-arigeo-black hover:text-arigeo-red hover:border-arigeo-red transition-colors pb-1">
            View All Products
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-arigeo-softwhite mb-4">
                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-arigeo-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                  {prod.badge}
                </div>
              </div>
              <div className="px-2">
                <p className="text-xs font-bold text-arigeo-darkgray uppercase tracking-widest mb-1">{prod.cat}</p>
                <h3 className="text-xl font-bold text-arigeo-black">{prod.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
