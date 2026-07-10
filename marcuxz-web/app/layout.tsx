import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const notoTh = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marcuxzweb.com"),
  title: "รับทำเว็บไซต์พรีเมียม ระบบ AI และอัตโนมัติ | Marcuxz Web",
  description: "Marcuxz Web รับสร้างเว็บไซต์ระดับพรีเมียม โหลดเร็ว รองรับ SEO พร้อมระบบ AI และระบบอัตโนมัติ เพื่อให้ธุรกิจของคุณเติบโตอย่างยั่งยืน เปลี่ยนผู้เข้าชมเป็นลูกค้าจริง",
  keywords: "รับทำเว็บไซต์, รับทำเว็บบริษัท, รับทำ Landing Page, รับทำเว็บ SEO, รับทำเว็บไซต์ Next.js, รับทำระบบ AI, รับทำระบบอัตโนมัติ, รับทำเว็บธุรกิจ, เว็บไซต์บริษัท, ออกแบบเว็บไซต์พรีเมียม",
  openGraph: {
    title: "รับทำเว็บไซต์พรีเมียม ระบบ AI และอัตโนมัติ | Marcuxz Web",
    description: "รับสร้างเว็บไซต์ระดับพรีเมียม โหลดเร็ว รองรับ SEO พร้อมระบบ AI และระบบอัตโนมัติ เปลี่ยนผู้เข้าชมเป็นลูกค้าจริง",
    url: "https://marcuxzweb.com",
    siteName: "Marcuxz Web",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "รับทำเว็บไซต์พรีเมียม ระบบ AI และอัตโนมัติ | Marcuxz Web",
    description: "รับสร้างเว็บไซต์ระดับพรีเมียม โหลดเร็ว รองรับ SEO พร้อมระบบ AI และระบบอัตโนมัติ เปลี่ยนผู้เข้าชมเป็นลูกค้าจริง",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://marcuxzweb.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className={notoTh.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
