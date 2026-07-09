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
        background: "#FFFFFF",
        foreground: "#0B0B0D",
        arigeo: {
          red: "#C70012",      // Primary Red
          darkred: "#D71920",  // Alt Red
          black: "#0B0B0D",    // Deep Black
          white: "#FFFFFF",    // White
          softwhite: "#F7F7F8",// Light Gray/Soft White
          darkgray: "#1F1F22", // Dark Gray
          border: "#E5E5E5",   // Border Gray
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
