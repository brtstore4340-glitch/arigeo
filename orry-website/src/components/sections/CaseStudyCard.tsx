'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../primitives';

interface CaseStudySectionData {
  title: string;
  content: string;
}

interface CaseStudyCardProps {
  client: string;
  headline: string;
  sections: {
    challenge: CaseStudySectionData;
    thinking: CaseStudySectionData;
    approach: CaseStudySectionData;
    solution: CaseStudySectionData;
    outcome: CaseStudySectionData;
  };
  cta?: {
    label: string;
    onClick?: () => void;
  };
  featured?: boolean;
  image?: string;
}

/**
 * CaseStudyCard Component
 * Detailed case study card with sections
 * Features: featured/compact variants, responsive grid layout
 */
export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  client,
  headline,
  sections,
  cta,
  featured = false,
  image,
}) => {
  const containerClass = featured
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
    : 'flex flex-col';

  return (
    <motion.div
      className={`${containerClass} bg-white rounded-lg border-2 border-gray-200 overflow-hidden`}
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{ boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section (featured only) */}
      {featured && image && (
        <motion.div
          className="relative h-96 overflow-hidden rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <img
            src={image}
            alt={client}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div className="p-8">
        <p
          className="text-sm font-semibold uppercase mb-2"
          style={{ color: 'var(--color-burgundy)' }}
        >
          {client}
        </p>

        <h3
          className="text-2xl sm:text-3xl font-bold mb-6"
          style={{ color: 'var(--color-burgundy)' }}
        >
          {headline}
        </h3>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h4
                className="font-bold text-sm uppercase mb-2"
                style={{ color: 'var(--color-burgundy)' }}
              >
                {section.title}
              </h4>
              <p className="text-sm text-gray-600" style={{ color: 'var(--color-text)' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {cta && (
          <Button label={cta.label} onClick={cta.onClick} variant="primary" size="md" />
        )}
      </motion.div>
    </motion.div>
  );
};

CaseStudyCard.displayName = 'CaseStudyCard';
