"use client";

import React, { CSSProperties } from 'react';

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 14,
  borderRadius: 999,
  width: 'fit-content',
  alignSelf: 'flex-start',
  opacity: 0.8,
  padding: '9px 10px 9px 32px',
  fontSize: 16,
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans), sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  transition: 'transform .22s ease, box-shadow .22s ease, color .2s ease, border-color .2s ease',
  textDecoration: 'none',
} as const;

const variantStyle = {
  primary: {
    background: `linear-gradient(180deg, var(--color-primary), var(--color-primary-hover))`,
    color: 'var(--color-primary-ink)',
    boxShadow: `0 0 0 3px var(--color-primary-tint), var(--shadow-btn-primary)`,
  },
  secondary: {
    background: 'transparent',
    color: 'var(--arigeo-black)',
    border: '1px solid var(--arigeo-black)',
    padding: '13px 18px',
  },
};

function PlayBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '2px solid currentColor', flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 4l14 8-14 8V4z" />
      </svg>
    </span>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  showArrow?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Button({ href, variant = 'primary', children, onClick, disabled, type = 'button', showArrow = true, style, className }: ButtonProps) {
  const [hover, setHover] = React.useState(false);

  const variantStyles = variantStyle[variant as keyof typeof variantStyle];
  const cls: CSSProperties = {
    ...base,
    ...variantStyles,
    opacity: disabled ? 0.4 : 0.8,
    pointerEvents: disabled ? 'none' : 'auto',
    ...(hover && !disabled ? (variant === 'primary'
      ? { transform: 'translateY(-1px)', boxShadow: `0 0 0 3px var(--color-primary-tint), var(--shadow-btn-primary-hover)` }
      : { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }) : {}),
    ...style,
  };

  const icon = variant === 'primary' ? <PlayBadge /> : <Arrow />;
  const content = (<>{children}{showArrow && icon}</>);

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={cls}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={cls}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {content}
    </button>
  );
}
