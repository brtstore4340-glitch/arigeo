"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function TrustSignals() {
  const badges = [
    { name: 'ISO 9001:2015', desc: 'Quality Management' },
    { name: 'GMP Certified', desc: 'Good Manufacturing Practice' },
    { name: 'GDP Standard', desc: 'Good Distribution Practice' },
    { name: 'FDA Approved', desc: 'Regulatory Compliance' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-8 relative z-20 shadow-sm">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm font-bold text-arigeo-darkgray uppercase tracking-widest flex-shrink-0">
          Trusted By Industry Standards
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-12 w-full">
          {badges.map((badge, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-arigeo-red" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-arigeo-black text-sm">{badge.name}</div>
                <div className="text-[10px] text-gray-500 uppercase">{badge.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
