'use client'

import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  isDark?: boolean
}

export function ThemeToggle({ isDark }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const currentTheme = (stored as 'light' | 'dark' | null) || (isSystemDark ? 'dark' : 'light')
    setTheme(currentTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return (
      <button
        className="p-sm text-captain-text hover:opacity-80 transition-opacity"
        aria-label="Toggle theme"
        disabled
      >
        🌙
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-sm rounded-sm transition-all ${
        isDark
          ? 'text-white hover:bg-white/10'
          : 'text-captain-text hover:bg-captain-light'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
