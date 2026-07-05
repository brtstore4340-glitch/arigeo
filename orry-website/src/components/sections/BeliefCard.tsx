'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BeliefCardProps {
  headline: string;
  description: string;
}

/**
 * BeliefCard Component
 * Large text card expressing brand belief
 * Features: hover border accent, responsive, centered layout
 */
export const BeliefCard: React.FC<BeliefCardProps> = ({
  headline,
  description,
}) => {
  return (
    <motion.div
      className="max-w-3xl mx-auto p-8 sm:p-12 bg-white rounded-lg border-2 border-gray-200"
      style={{ backgroundColor: 'var(--color-cream)', borderColor: 'var(--color-border)' }}
      whileHover={{
        borderColor: 'var(--color-burgundy)',
        backgroundColor: 'var(--color-cream)',
      }}
      transition={{ duration: 0.3 }}
    >
      <h3
        className="text-2xl sm:text-3xl font-bold mb-4"
        style={{ color: 'var(--color-burgundy)' }}
      >
        {headline}
      </h3>
      <p
        className="text-lg text-gray-600 leading-relaxed"
        style={{ color: 'var(--color-text)' }}
      >
        {description}
      </p>
    </motion.div>
  );
};

BeliefCard.displayName = 'BeliefCard';
