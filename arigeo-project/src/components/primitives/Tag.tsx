import React from 'react';

export default function Tag({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'brand' }) {
  const toneClass =
    tone === 'brand'
      ? 'bg-arigeo-red/40 text-arigeo-red-ink border-transparent'
      : 'bg-white text-arigeo-gray border-gray-200';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium border ${toneClass}`}>
      {children}
    </span>
  );
}
