'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

interface FooterProps {
  columns: FooterColumn[];
  company?: {
    name: string;
    tagline: string;
  };
  social?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  copyright?: string;
}

/**
 * Footer Component
 * Multi-column footer with social links and copyright
 * Features: responsive grid, dark background, accessibility
 */
export const FooterRefactored: React.FC<FooterProps> = ({
  columns,
  company,
  social,
  copyright,
}) => {
  return (
    <motion.footer
      className="mt-16 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t-2 border-gray-200"
      style={{ backgroundColor: 'var(--color-burgundy)', color: 'white' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          {company && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
                {company.name}
              </h3>
              <p className="text-sm text-gray-200">{company.tagline}</p>
            </motion.div>
          )}

          {/* Footer Columns */}
          {columns.map((column, idx) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.1 }}
            >
              <h4 className="font-bold mb-4" style={{ color: 'var(--color-gold)' }}>
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-200 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="border-t border-gray-400 my-8 opacity-50"
        />

        {/* Social Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {social && social.length > 0 && (
            <div className="flex gap-4 mb-4 sm:mb-0">
              {social.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          )}

          {copyright && (
            <p className="text-sm text-gray-300 text-center sm:text-right">
              {copyright}
            </p>
          )}
        </div>
      </div>
    </motion.footer>
  );
};

FooterRefactored.displayName = 'FooterRefactored';
