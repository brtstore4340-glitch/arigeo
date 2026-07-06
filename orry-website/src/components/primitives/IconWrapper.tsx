'use client';

import React from 'react';

interface IconWrapperProps {
  icon: React.ReactNode;
  size?: 32 | 40 | 48;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * IconWrapper Component
 * Consistent sizing and color for icons
 * Features: multiple sizes, color control, accessibility
 */
export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  size = 32,
  color = 'var(--color-burgundy)',
  className = '',
  ariaLabel,
}) => {
  const sizeClasses = {
    32: 'w-8 h-8',
    40: 'w-10 h-10',
    48: 'w-12 h-12',
  };

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      style={{ color }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      {icon}
    </span>
  );
};

IconWrapper.displayName = 'IconWrapper';
