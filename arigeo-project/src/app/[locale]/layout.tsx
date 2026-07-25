import '../globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// IBM Plex Sans Thai is the sole --font-sans (interim stand-in for the
// unlicensed DB Helvethaica) per the 2026-07-23 rebrand — Prompt/Noto dropped.
const plexSansThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-thai',
});

export const metadata: Metadata = {
  title: 'ARIGEO | Captain Maid, GenuLeaf, CeraTory',
  description: "We don't follow categories. We create them. ARIGEO brings together household care and skincare brands — Captain Maid, GenuLeaf, CeraTory — built on trust, safety and quality.",
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={plexSansThai.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
