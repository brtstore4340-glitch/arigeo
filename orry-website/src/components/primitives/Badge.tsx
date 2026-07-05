'use client';

import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

/**
 * Badge Component
 * Small label with background color
 * Features: multiple variants, uppercase text, pill-shaped
 */
export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-burgundy text-white',
    secondary: 'bg-cream text-burgundy border-2 border-burgundy',
    accent: 'bg-gold text-burgundy',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-semibold
        uppercase tracking-wide
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--color-burgundy)' : 'var(--color-accent)',
        color: variant === 'primary' ? 'white' : 'var(--color-burgundy)',
      }}
    >
      {text}
    </span>
  );
};

Badge.displayName = 'Badge';
