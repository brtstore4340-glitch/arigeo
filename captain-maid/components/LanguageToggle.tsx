'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LanguageToggleProps {
  isDark?: boolean
}

export function LanguageToggle({ isDark }: LanguageToggleProps) {
  const pathname = usePathname()

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'th'
  const toggleLocale = currentLocale === 'th' ? 'en' : 'th'
  const newPath = pathname.replace(/^\/\w{2}(?=\/|$)/, `/${toggleLocale}`) || `/${toggleLocale}`

  return (
    <Link
      href={newPath}
      className={`px-md py-sm rounded-sm font-medium text-sm transition-all border ${
        isDark
          ? 'text-white border-white/40 hover:bg-white/10'
          : 'text-captain-text border-captain-neutral hover:bg-captain-light'
      }`}
      aria-label={`Switch to ${toggleLocale === 'th' ? 'Thai' : 'English'}`}
    >
      {currentLocale === 'th' ? '🇹🇭 ไทย' : '🇬🇧 English'}
    </Link>
  )
}
