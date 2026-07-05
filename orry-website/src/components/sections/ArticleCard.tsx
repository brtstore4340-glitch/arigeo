'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  readMoreHref?: string;
}

/**
 * ArticleCard Component
 * Blog/article card with image, category, title, and excerpt
 * Features: equal height, hover lift effect, responsive
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  category,
  title,
  excerpt,
  readMoreHref = '#',
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden h-full flex flex-col"
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span
          className="text-xs font-semibold uppercase mb-2"
          style={{ color: 'var(--color-burgundy)' }}
        >
          {category}
        </span>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--color-burgundy)' }}
        >
          {title}
        </h3>

        <p
          className="text-sm text-gray-600 mb-4 flex-grow"
          style={{ color: 'var(--color-text)' }}
        >
          {excerpt}
        </p>

        <a
          href={readMoreHref}
          className="text-sm font-semibold hover:underline"
          style={{ color: 'var(--color-burgundy)' }}
        >
          Read More →
        </a>
      </div>
    </motion.div>
  );
};

ArticleCard.displayName = 'ArticleCard';
