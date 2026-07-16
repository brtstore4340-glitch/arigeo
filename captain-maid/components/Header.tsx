'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'

export function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (mobileMenuOpen) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 6

      // Determine scroll direction
      if (currentScrollY === 0) {
        setIsAtTop(true)
        setIsVisible(true)
        setHasScrolled(false)
      } else {
        setIsAtTop(false)
        setHasScrolled(true)

        // Hide header on scroll down, show on scroll up
        if (currentScrollY - lastScrollY > scrollThreshold) {
          setIsVisible(false)
        } else if (lastScrollY - currentScrollY > scrollThreshold) {
          setIsVisible(true)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[420ms] cubic-bezier(0.22, 1, 0.36, 1) ${
        isAtTop ? 'bg-transparent' : 'bg-captain-cream shadow-sm dark:bg-captain-cream-dark dark:shadow-captain-neutral/20'
      } ${!isVisible && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <nav className="container-safe flex justify-between items-center py-md">
        {/* Logo */}
        <Link href="/" className={`text-xl font-bold font-serif transition-colors ${isAtTop && !hasScrolled ? 'text-white' : 'text-captain-blue'}`}>
          ⚓ Captain Maid
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-lg items-center">
          <Link
            href="#products"
            className={`font-medium transition-opacity hover:opacity-80 ${isAtTop && !hasScrolled ? 'text-white' : 'text-captain-text'}`}
          >
            Products
          </Link>
          <Link
            href="#tips"
            className={`font-medium transition-opacity hover:opacity-80 ${isAtTop && !hasScrolled ? 'text-white' : 'text-captain-text'}`}
          >
            Tips
          </Link>
          <Link
            href="#about"
            className={`font-medium transition-opacity hover:opacity-80 ${isAtTop && !hasScrolled ? 'text-white' : 'text-captain-text'}`}
          >
            About
          </Link>
          <Link
            href="#contact"
            className={`font-medium transition-opacity hover:opacity-80 ${isAtTop && !hasScrolled ? 'text-white' : 'text-captain-text'}`}
          >
            Contact
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex gap-sm items-center">
          <LanguageToggle isDark={isAtTop && !hasScrolled} />
          <ThemeToggle isDark={isAtTop && !hasScrolled} />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-sm transition-colors ${isAtTop && !hasScrolled ? 'text-white hover:bg-white/10' : 'text-captain-text hover:bg-captain-light'}`}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-captain-cream dark:bg-captain-cream-dark border-t border-captain-light">
          <div className="container-safe py-lg space-y-md">
            <Link href="#products" className="block text-captain-text font-medium hover:text-captain-blue" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link href="#tips" className="block text-captain-text font-medium hover:text-captain-blue" onClick={() => setMobileMenuOpen(false)}>
              Tips
            </Link>
            <Link href="#about" className="block text-captain-text font-medium hover:text-captain-blue" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="#contact" className="block text-captain-text font-medium hover:text-captain-blue" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
