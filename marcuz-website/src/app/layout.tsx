import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/styles/globals.css';
import { content } from '@/lib/content';

export const metadata: Metadata = {
  title: content.site.title,
  description: content.site.description,
  openGraph: {
    title: content.site.title,
    description: content.site.description,
    url: content.site.url,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: content.site.title,
    description: content.site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={content.site.url} />
      </head>
      <body>
        <a href="#main" style={{ position: 'absolute', left: '-9999px' }}>
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
