'use client';

import React from 'react';

interface SpacerProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Spacer Component
 * Flexible spacing element for layout control
 * Features: multiple size options, vertical/horizontal, responsive
 */
export const Spacer: React.FC<SpacerProps> = ({
  size,
  direction = 'vertical',
  className = '',
}) => {
  const spacingMap = {
    xs: direction === 'vertical' ? 'h-2' : 'w-2',
    sm: direction === 'vertical' ? 'h-4' : 'w-4',
    md: direction === 'vertical' ? 'h-6' : 'w-6',
    lg: direction === 'vertical' ? 'h-8' : 'w-8',
    xl: direction === 'vertical' ? 'h-12' : 'w-12',
    '2xl': direction === 'vertical' ? 'h-16' : 'w-16',
    '3xl': direction === 'vertical' ? 'h-24' : 'w-24',
  };

  return (
    <div
      className={`${spacingMap[size]} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
};

Spacer.displayName = 'Spacer';
