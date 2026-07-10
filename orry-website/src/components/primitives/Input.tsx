'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password' | 'phone' | 'number';
  variant?: 'input' | 'textarea';
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  rows?: number;
}

/**
 * Input Component
 * Form input with label, error handling, and focus states
 * Features: validation states, accessibility, error messages
 */
export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({
  label,
  placeholder,
  error,
  required = false,
  value,
  onChange,
  onBlur,
  type = 'text',
  variant = 'input',
  disabled = false,
  className = '',
  name,
  id,
  rows = 4,
}, ref) => {
  const inputId = id || name || `input-${Math.random()}`;
  const errorId = error ? `${inputId}-error` : undefined;

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 border-gray-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy
    focus:border-burgundy transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    min-h-[44px]
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `;

  const containerClasses = 'w-full flex flex-col gap-2';

  return (
    <motion.div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
          style={{ color: 'var(--color-text)' }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {variant === 'input' ? (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={inputClasses}
          style={{ borderColor: error ? '#ef4444' : 'var(--color-border)' }}
        />
      ) : (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={inputClasses}
          style={{ borderColor: error ? '#ef4444' : 'var(--color-border)' }}
        />
      )}

      {error && (
        <motion.p
          id={errorId}
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';
