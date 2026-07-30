"use client";

import React, { ReactNode, CSSProperties } from 'react';

interface TagProps {
  children: ReactNode;
  tone?: 'default' | 'brand';
  style?: CSSProperties;
}

export function Tag({ children, tone = 'default', style }: TagProps) {
  const toneStyle: CSSProperties = tone === 'brand'
    ? { background: 'var(--color-primary-tint)', color: 'var(--color-primary-ink)', border: '1px solid transparent' }
    : { background: '#fff', color: 'var(--arigeo-gray)', border: '1px solid #e5e7eb' };

  return (
    <span style={{ display: 'inline-block', borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)', ...toneStyle, ...style }}>
      {children}
    </span>
  );
}
