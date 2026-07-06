'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  intro?: string;
  className?: string;
  bgColor?: 'white' | 'cream' | 'gray';
  id?: string;
}

/**
 * Section Component
 * Page section container with standardized padding
 * Features: title/intro support, background colors, responsive padding
 */
export const Section: React.FC<SectionProps> = ({
  children,
  title,
  intro,
  className = '',
  bgColor = 'white',
  id,
}) => {
  const bgClasses = {
    white: 'bg-white',
    cream: 'bg-cream',
    gray: 'bg-gray-50',
  };

  return (
    <motion.section
      id={id}
      className={`
        py-16 sm:py-24 lg:py-32
        px-4 sm:px-6 lg:px-8
        ${bgClasses[bgColor]}
        ${className}
      `}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: bgColor === 'cream' ? 'var(--color-cream)' : undefined,
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        {title && (
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-burgundy)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
        )}

        {intro && (
          <motion.p
            className="text-lg text-gray-600 mb-12"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {intro}
          </motion.p>
        )}

        {children}
      </div>
    </motion.section>
  );
};

Section.displayName = 'Section';
