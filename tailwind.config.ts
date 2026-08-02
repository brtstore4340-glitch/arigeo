import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        "background-dark": "#0A0E27",
        foreground: "#111111",
        "foreground-dark": "#F5F5F5",
        arigeo: {
          red: "#D50306",
          darkred: "#C50C15",
          redtint: "#FBE6E7",
          black: "#010101",
          gray: "#424242",
          light: "#FDFDFD",
          surface: "#F3F3F4",
          "surface-dark": "#1A1E3F",
          "text-dark": "#E0E0E0",
          household: {
            DEFAULT: "#F5EFE6",
            "dark": "#2A2416",
            accent: "#B08D57",
            "accent-dark": "#D4AF87",
          },
          skincare: {
            DEFAULT: "#EEF3F4",
            "dark": "#1A2526",
            accent: "#6E9A9E",
            "accent-dark": "#8FB5B9",
          },
        },
      },
      fontFamily: {
        sans: [
          "var(--font-prompt)",
          "var(--font-plex-thai)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
