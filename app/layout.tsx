import type { Metadata } from "next";
import { Arimo, IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../src/styles/globals.css";
import "../src/styles/design-tokens.css";
import "../src/styles/animations.css";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-arimo",
  display: "swap",
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARIGEO",
  description:
    "ARIGEO: High-quality, sustainable products for everyday care. Experience beauty and wellness with our innovative product line.",
  openGraph: {
    title: "ARIGEO",
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
        className={`${arimo.variable} ${plexThai.variable} ${inter.variable}`}
        style={{
          fontFamily:
            "var(--font-sans, 'Arimo', 'IBM Plex Sans Thai', sans-serif)",
        }}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
