import Link from 'next/link'
import { LanguageToggle } from './LanguageToggle'

const footerLinks = {
  products: [
    { label: 'Floor Care', href: '/products?category=floor' },
    { label: 'Kitchen & Bath', href: '/products?category=kitchen' },
    { label: 'Specialty Care', href: '/products?category=specialty' },
    { label: 'Shop All', href: '/products' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Sustainability', href: '/about#sustainability' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ],
  connect: [
    { label: 'Facebook', href: 'https://facebook.com/captainmaid' },
    { label: 'Instagram', href: 'https://instagram.com/captainmaid' },
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'Blog', href: '/blog' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-captain-blue text-white pt-2xl pb-lg mt-2xl">
      <div className="container-safe">
        {/* Language Toggle */}
        <div className="flex justify-center gap-sm mb-xl pb-xl border-b border-white/20">
          <Link
            href="/"
            className="px-md py-sm bg-white/20 text-white rounded-sm hover:bg-white/30 transition-colors font-medium text-sm"
            lang="th"
          >
            🇹🇭 ไทย
          </Link>
          <Link
            href="/en"
            className="px-md py-sm bg-white/20 text-white rounded-sm hover:bg-white/30 transition-colors font-medium text-sm"
            lang="en"
          >
            🇬🇧 English
          </Link>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          {/* Products Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-captain-yellow mb-md">
              Products
            </h4>
            <ul className="space-y-sm">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-captain-yellow mb-md">
              Company
            </h4>
            <ul className="space-y-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-captain-yellow mb-md">
              Support
            </h4>
            <ul className="space-y-sm">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-captain-yellow mb-md">
              Connect
            </h4>
            <ul className="space-y-sm">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-white/80 hover:text-white transition-colors font-medium text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 pt-lg text-center text-sm text-white/70">
          <p>
            &copy; {currentYear} Captain Maid. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Captain Maid',
            url: 'https://captain-maid.vercel.app',
            logo: 'https://captain-maid.vercel.app/logo.png',
            sameAs: [
              'https://facebook.com/captainmaid',
              'https://instagram.com/captainmaid',
            ],
          }),
        }}
      />
    </footer>
  )
}
