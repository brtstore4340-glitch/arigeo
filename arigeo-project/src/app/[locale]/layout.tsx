import '../globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

export const metadata: Metadata = {
  title: 'ARIGEO COMPANY LIMITED',
  description: 'บริษัท อะริเกโอ จำกัด (ARIGEO) จัดจำหน่ายยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตรแบบครบวงจร',
};

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} className={notoSansThai.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
