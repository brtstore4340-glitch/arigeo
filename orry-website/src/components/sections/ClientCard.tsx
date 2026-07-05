'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ClientCardProps {
  logo: string;
  name: string;
  role?: string;
  status?: string;
}

/**
 * ClientCard Component
 * Card displaying client/partner information
 * Features: centered logo, hover effects, responsive grid support
 */
export const ClientCard: React.FC<ClientCardProps> = ({
  logo,
  name,
  role,
  status,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200"
      style={{ backgroundColor: 'var(--color-cream)' }}
      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.3 }}
    >
      <img src={logo} alt={name} className="h-16 w-auto mb-4" />
      <h3 className="text-lg font-semibold text-center mb-2" style={{ color: 'var(--color-burgundy)' }}>
        {name}
      </h3>
      {role && <p className="text-sm text-gray-600 text-center mb-2">{role}</p>}
      {status && (
        <span
          className="text-xs font-semibold uppercase px-3 py-1 rounded-full"
          style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-burgundy)' }}
        >
          {status}
        </span>
      )}
    </motion.div>
  );
};

ClientCard.displayName = 'ClientCard';
