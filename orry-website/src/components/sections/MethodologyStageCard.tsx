'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MethodologyStageCardProps {
  number: number;
  title: string;
  duration: string;
  purpose: string;
  content: string[];
  humanCentered?: boolean;
}

/**
 * MethodologyStageCard Component
 * Individual stage in methodology timeline
 * Features: numbered circle, hover effects, thick border
 */
export const MethodologyStageCard: React.FC<MethodologyStageCardProps> = ({
  number,
  title,
  duration,
  purpose,
  content,
  humanCentered = false,
}) => {
  return (
    <motion.div
      className="p-6 bg-white rounded-lg border-4 border-gray-300"
      style={{ borderColor: 'var(--color-border)' }}
      whileHover={{
        borderColor: 'var(--color-burgundy)',
        backgroundColor: 'var(--color-cream)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Number Circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-4"
        style={{ backgroundColor: 'var(--color-burgundy)' }}
      >
        {number}
      </div>

      <h3
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--color-burgundy)' }}
      >
        {title}
      </h3>

      <p className="text-sm text-gray-500 mb-3">{duration}</p>

      <p
        className="text-sm font-semibold mb-4"
        style={{ color: 'var(--color-burgundy)' }}
      >
        {purpose}
      </p>

      <ul className="space-y-2">
        {content.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="mt-1">→</span>
            {item}
          </li>
        ))}
      </ul>

      {humanCentered && (
        <div
          className="mt-4 px-3 py-1 rounded-full text-xs font-semibold inline-block"
          style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-burgundy)' }}
        >
          Human-Centered
        </div>
      )}
    </motion.div>
  );
};

MethodologyStageCard.displayName = 'MethodologyStageCard';
