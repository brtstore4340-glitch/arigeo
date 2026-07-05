'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  rating?: number;
}

/**
 * TestimonialCard Component
 * Customer testimonial with optional rating and image
 * Features: star rating, author info, quote styling
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  image,
  rating = 5,
}) => {
  return (
    <motion.div
      className="p-8 bg-white rounded-lg border-2 border-gray-200"
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{ boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Star Rating */}
      {rating && (
        <div className="mb-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span
              key={idx}
              className={idx < rating ? 'text-lg' : 'text-gray-300'}
              style={{ color: idx < rating ? 'var(--color-gold)' : undefined }}
            >
              ★
            </span>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="mb-6">
        <p
          className="text-lg italic text-gray-600"
          style={{ color: 'var(--color-text)' }}
        >
          "{quote}"
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {image && (
          <img
            src={image}
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p
            className="font-bold"
            style={{ color: 'var(--color-burgundy)' }}
          >
            {author}
          </p>
          {role && (
            <p className="text-sm text-gray-500">{role}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

TestimonialCard.displayName = 'TestimonialCard';
