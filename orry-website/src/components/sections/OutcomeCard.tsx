'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OutcomeCardProps {
  icon: React.ReactNode;
  headline: string;
  description: string;
  examples?: string[];
}

/**
 * OutcomeCard Component
 * Card showcasing positive outcomes with examples
 * Features: icon + text + bullet list, min height for grid consistency
 */
export const OutcomeCard: React.FC<OutcomeCardProps> = ({
  icon,
  headline,
  description,
  examples,
}) => {
  return (
    <motion.div
      className="p-8 bg-white rounded-lg border-2 border-gray-200 min-h-[400px] flex flex-col"
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{
        y: -8,
        boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
        backgroundColor: 'var(--color-cream)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 text-4xl" style={{ color: 'var(--color-burgundy)' }}>
        {icon}
      </div>

      <h3
        className="text-xl font-bold mb-3"
        style={{ color: 'var(--color-burgundy)' }}
      >
        {headline}
      </h3>

      <p
        className="text-gray-600 mb-6 flex-grow"
        style={{ color: 'var(--color-text)' }}
      >
        {description}
      </p>

      {examples && examples.length > 0 && (
        <ul className="space-y-2">
          {examples.map((example, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-600 flex items-start gap-2"
              style={{ color: 'var(--color-text)' }}
            >
              <span
                className="font-bold mt-1"
                style={{ color: 'var(--color-burgundy)' }}
              >
                •
              </span>
              {example}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

OutcomeCard.displayName = 'OutcomeCard';
