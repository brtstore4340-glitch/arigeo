'use client'

import { useEffect, createContext, useContext, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme | null
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const updateTheme = (newTheme: Theme) => {
      const root = document.documentElement
      root.setAttribute('data-theme', newTheme)
      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      localStorage.setItem('theme', newTheme)
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }))
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        updateTheme(e.newValue as Theme)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: null, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
