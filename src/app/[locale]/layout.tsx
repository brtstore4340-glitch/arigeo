import { IBM_Plex_Sans_Thai, Prompt } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import { ReactNode } from 'react';

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-prompt',
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-thai',
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Retrieve the messages for the current locale to pass to the client context
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${prompt.variable} ${ibmPlexSansThai.variable}`}>
      <body className={`${prompt.variable} ${ibmPlexSansThai.variable}`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
