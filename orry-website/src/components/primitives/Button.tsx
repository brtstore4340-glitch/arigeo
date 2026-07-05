'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

/**
 * Button Component
 * Versatile button with multiple variants and states
 * Features: loading state, icon support, disabled state, focus outline
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    label,
    onClick,
    disabled = false,
    loading = false,
    icon,
    size = 'md',
    variant = 'primary',
    className = '',
    type = 'button',
    ariaLabel,
  }, ref) => {
    const isDisabled = disabled || loading;

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base min-h-[44px] flex items-center justify-center',
      lg: 'px-8 py-4 text-lg min-h-[48px] flex items-center justify-center',
    };

    const variantClasses = {
      primary: 'text-white hover:bg-opacity-90 active:scale-95',
      secondary: 'text-burgundy border-2 border-burgundy hover:bg-opacity-80',
      ghost: 'bg-transparent text-burgundy border-2 border-burgundy hover:bg-cream',
    };

    const baseClasses = `
      rounded-lg font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center gap-2 justify-center
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `;

    const styleObj = variant === 'primary' ? { backgroundColor: 'var(--color-burgundy)' } : {};

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        aria-label={ariaLabel || label}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={baseClasses}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        initial={{ opacity: 1 }}
        animate={{ opacity: isDisabled ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
        style={styleObj}
      >
        {loading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⟳
          </motion.span>
        )}
        {icon && !loading && icon}
        {label}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
