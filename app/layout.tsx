import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../src/styles/globals.css";
import "../src/styles/design-tokens.css";
import "../src/styles/animations.css";

const inter = Inter({ subsets: ["latin"] });
const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"] });

export const metadata: Metadata = {
  title: "ARIGEO - Kao Thailand",
  description:
    "ARIGEO: High-quality, sustainable products for everyday care. Experience beauty and wellness with our innovative product line.",
  openGraph: {
    title: "ARIGEO - Kao Thailand",
    description: "High-quality, sustainable products for everyday care",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#010101" />
      </head>
      <body
        className={`${inter.className} ${notoSansThai.className}`}
        style={{
          fontFamily:
            "var(--font-sans, 'Inter', 'Noto Sans Thai', sans-serif)",
        }}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
