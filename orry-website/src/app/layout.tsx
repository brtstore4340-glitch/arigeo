import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORRY Thailand - Natural Lip Care',
  description: 'Discover ORRY: Premium natural lip care products from Thailand. WHISPER, BREEZE, VELVET.',
  authors: [{ name: 'ORRY Thailand' }],
  keywords: ['lip care', 'natural beauty', 'Thailand', 'ORRY', 'cosmetics'],
  openGraph: {
    title: 'ORRY Thailand - Natural Lip Care',
    description: 'Premium natural lip care crafted from Thai tradition and science.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' font-size='50' text-anchor='middle' dominant-baseline='central'>💋</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
