'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
}

/**
 * Card Component
 * Container with rounded corners, border, and shadow
 * Features: hover effects, customizable shadow, responsive
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  onClick,
  hoverable = false,
  shadow = 'md',
}, ref) => {
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const cardClasses = `
    rounded-xl bg-white border-2 border-gray-200
    transition-all duration-300
    ${shadowClasses[shadow]}
    ${hoverable ? 'cursor-pointer hover:shadow-lg hover:border-burgundy' : ''}
    ${className}
  `;

  return (
    <motion.div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
