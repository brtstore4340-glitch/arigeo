import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111111", // black
        arigeo: {
          // Blush corporate-minimal palette — 2026-07-23 rebrand (Kao-influenced)
          red: "#f4cccc",       // blush fill (buttons, badges, dot marks) — never white text on this
          darkred: "#e7a8a8",   // blush hover/pressed fill
          "red-ink": "#783636", // readable text/icon color for the red family
          black: "#010101",
          gray: "#5c5c5c",      // muted text
          light: "#F3F3F4",     // Platinum surface
          line: "#e9e9e9",      // hairline borders (legacy soft system)
          "line-strong": "rgba(17,17,17,0.12)", // hairline borders (new flat-bordered system)
        },
        card: {
          green: "#eef6f1",
          "green-ink": "#4c7a5d",
          blue: "#eef3f8",
          "blue-ink": "#3e6e8e",
          gray: "#f4f4f5",
          "gray-ink": "#5c5c5c",
        },
      },
      fontFamily: {
        sans: ['var(--font-plex-thai)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hero-wipe': 'heroWipe 2200ms cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        heroWipe: {
          '0%': { clipPath: 'circle(0% at 50% 100%)' },
          '100%': { clipPath: 'circle(150% at 50% 100%)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
