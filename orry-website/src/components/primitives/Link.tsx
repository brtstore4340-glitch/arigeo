'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

interface LinkProps {
  href: string;
  label: string;
  external?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Link Component
 * Wrapper around Next.js Link with styling and external link handling
 * Features: accent color, underline on hover, external link security
 */
export const Link: React.FC<LinkProps> = ({
  href,
  label,
  external = false,
  icon,
  className = '',
  children,
}) => {
  const linkClasses = `
    inline-flex items-center gap-1
    text-burgundy hover:underline
    transition-colors duration-200
    ${className}
  `;

  const content = (
    <>
      {icon && <span>{icon}</span>}
      {children || label}
    </>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        style={{ color: 'var(--color-burgundy)' }}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
      <NextLink href={href} className={linkClasses} style={{ color: 'var(--color-burgundy)' }}>
        {content}
      </NextLink>
    </motion.div>
  );
};

Link.displayName = 'Link';
