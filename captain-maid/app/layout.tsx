import type { Metadata, Viewport } from 'next'
import { Poppins, Crimson_Text } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

const sans = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const serif = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Captain Maid | Premium Household Cleaning Products',
  description: 'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home.',
  applicationName: 'Captain Maid',
  metadataBase: new URL('https://captain-maid.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'th-TH': '/th',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://captain-maid.vercel.app',
    title: 'Captain Maid | Premium Household Cleaning Products',
    description: 'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home.',
    siteName: 'Captain Maid',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Captain Maid – Clean Homes, Happy Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Captain Maid | Premium Household Cleaning Products',
    description: 'Trusted cleaning solutions for Thai families.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  keywords: [
    'cleaning products',
    'household cleaning',
    'Thai cleaning',
    'eco-friendly cleaning',
    'floor cleaner',
    'surface cleaner',
    'safe cleaning',
  ],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' ||
                    (!localStorage.getItem('theme') &&
                     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark')
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.setAttribute('data-theme', 'light')
                }
              } catch (e) {}
            `,
          }}
        />
        <meta name="theme-color" content="#003DA5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1F1D1A" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${sans.variable} ${serif.variable} font-sans`}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
