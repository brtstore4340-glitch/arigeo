import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        captain: {
          blue: '#003DA5',
          'blue-dark': '#002770',
          'blue-light': '#0052CC',
          cream: '#F5F2ED',
          'cream-dark': '#1F1D1A',
          yellow: '#FFB81C',
          'yellow-hover': '#E6A500',
          neutral: '#7A6F69',
          'neutral-light': '#9B8F87',
          success: '#2D7A3E',
          warning: '#D97706',
        },
      },
      fontFamily: {
        serif: ['"Georgia"', '"Garamond"', 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        mono: ['"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['2rem', { lineHeight: '2.5rem' }],
        '3xl': ['2.5rem', { lineHeight: '3rem' }],
        '4xl': ['3.5rem', { lineHeight: '4rem' }],
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '3rem',
        xl: '4.5rem',
        '2xl': '6rem',
      },
      keyframes: {
        'header-slide-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'header-slide-up': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'header-slide-down': 'header-slide-down 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'header-slide-up': 'header-slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      },
      maxWidth: {
        container: '1200px',
        prose: '65ch',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderRadius: {
        sm: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
