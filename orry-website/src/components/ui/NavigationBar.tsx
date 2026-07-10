'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationBarProps {
  items: NavItem[];
  currentPath?: string;
  logo?: React.ReactNode;
  logoHref?: string;
  className?: string;
}

/**
 * NavigationBar Component
 * Sticky navigation with mobile menu support
 * Features: hamburger menu, sticky positioning, responsive, z-index management
 */
export const NavigationBar: React.FC<NavigationBarProps> = ({
  items,
  currentPath,
  logo,
  logoHref = '/',
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => currentPath === href;

  return (
    <motion.nav
      className={`sticky top-0 z-100 w-full border-b-2 border-gray-200 ${className}`}
      style={{
        backgroundColor: 'var(--color-cream)',
        borderColor: 'var(--color-border)',
        height: '64px',
      }}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href={logoHref} className="font-bold text-xl flex-shrink-0">
            {logo || <span style={{ color: 'var(--color-burgundy)' }}>Logo</span>}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-burgundy font-bold'
                    : 'text-gray-700 hover:text-burgundy'
                }`}
                style={{
                  color: isActive(item.href) ? 'var(--color-burgundy)' : 'inherit',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className="text-2xl"
              style={{ color: 'var(--color-burgundy)' }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b-2 border-gray-200"
            style={{
              backgroundColor: 'var(--color-cream)',
              borderColor: 'var(--color-border)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isActive(item.href)
                      ? 'var(--color-burgundy)'
                      : 'inherit',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

NavigationBar.displayName = 'NavigationBar';
