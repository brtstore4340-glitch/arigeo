import React from 'react';
import DotAccent from './DotAccent';

export default function SectionHeading({
  eyebrow,
  title,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      {eyebrow && (
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-arigeo-red-ink">
          <DotAccent size="sm" />
          {eyebrow}
        </span>
      )}
      <h2 className="m-0 text-[32px] tracking-[-0.03em] text-arigeo-black font-extrabold">{title}</h2>
    </div>
  );
}
