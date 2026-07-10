'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../primitives';

interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface HeroSectionProps {
  headline: string;
  subheading: string;
  body: string;
  ctas: CTAButton[];
  socialProof?: string;
  image?: {
    src: string;
    alt: string;
  };
}

/**
 * HeroSection Component
 * Full-width hero section with headline, subheading, CTAs, and optional image
 * Features: parallax zoom, staggered animations, responsive layout
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheading,
  body,
  ctas,
  socialProof,
  image,
}) => {
  return (
    <motion.section
      className="relative w-full py-20 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-cream)', minHeight: '900px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              style={{ color: 'var(--color-burgundy)' }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {headline}
            </motion.h1>

            <motion.h2
              className="text-xl sm:text-2xl font-semibold mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subheading}
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              style={{ color: 'var(--color-text)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {body}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  label={cta.label}
                  onClick={cta.onClick}
                  variant={cta.variant || 'primary'}
                  size="lg"
                />
              ))}
            </motion.div>

            {/* Social Proof */}
            {socialProof && (
              <motion.p
                className="text-sm text-gray-500"
                style={{ color: 'var(--color-text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {socialProof}
              </motion.p>
            )}
          </motion.div>

          {/* Image */}
          {image && (
            <motion.div
              className="relative h-96 sm:h-[500px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

HeroSection.displayName = 'HeroSection';
