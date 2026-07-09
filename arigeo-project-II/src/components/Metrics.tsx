"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Metrics() {
  const metrics = [
    { value: '15+', label: 'ปีแห่งความเชี่ยวชาญ' },
    { value: '100+', label: 'โรงพยาบาลที่ไว้วางใจ' },
    { value: '99.9%', label: 'ความแม่นยำในการจัดส่ง' },
    { value: '24/7', label: 'ทีมสนับสนุนลูกค้า' },
  ];

  return (
    <section className="bg-arigeo-black border-t border-white/10 py-16 relative z-20">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center px-4"
            >
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">{metric.value}</h4>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
