'use client';

import React from 'react';
import NextImage from 'next/image';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

/**
 * Image Component
 * Wrapper around Next.js Image with responsive sizing
 * Features: blur placeholder, responsive, optimized loading
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23f3f4f6'/%3E%3C/svg%3E"
        className={`w-full h-auto ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
        style={{
          objectFit,
        }}
      />
    </div>
  );
};

Image.displayName = 'Image';
