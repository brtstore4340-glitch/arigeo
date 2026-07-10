'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProblemCardProps {
  icon: React.ReactNode;
  headline: string;
  description: string;
  impact?: string;
}

/**
 * ProblemCard Component
 * Card highlighting a problem with icon and description
 * Features: hover effects, equal height support, icon/text layout
 */
export const ProblemCard: React.FC<ProblemCardProps> = ({
  icon,
  headline,
  description,
  impact,
}) => {
  return (
    <motion.div
      className="p-8 bg-white rounded-lg border-2 border-gray-200 h-full flex flex-col"
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{
        borderColor: 'var(--color-burgundy)',
        backgroundColor: 'var(--color-cream)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={{ color: 'var(--color-burgundy)', fontSize: '32px' }}>
          {icon}
        </div>
        <h3 className="text-xl font-bold flex-1" style={{ color: 'var(--color-burgundy)' }}>
          {headline}
        </h3>
      </div>

      <p className="text-gray-600 mb-4 flex-grow" style={{ color: 'var(--color-text)' }}>
        {description}
      </p>

      {impact && (
        <p className="text-sm font-semibold text-gray-500" style={{ color: 'var(--color-text-secondary)' }}>
          {impact}
        </p>
      )}
    </motion.div>
  );
};

ProblemCard.displayName = 'ProblemCard';
