import React from 'react';

const sizeMap = { sm: 'w-1.5 h-1.5', md: 'w-2.5 h-2.5', lg: 'w-4 h-4' };

export default function DotAccent({ size = 'md' as keyof typeof sizeMap, className = '' }: { size?: keyof typeof sizeMap; className?: string }) {
  return <span aria-hidden="true" className={`inline-block rounded-full bg-arigeo-red ${sizeMap[size]} ${className}`} />;
}
