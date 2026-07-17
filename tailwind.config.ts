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
          red: "#D50306", // Brick Ember — primary brand red
          darkred: "#C50C15", // Brick Ember 2 — hover / pressed
          redtint: "#FBE6E7", // 5% tint — badge/tag backgrounds
          black: "#010101", // brand black — footer, headings
          gray: "#424242", // secondary text (คงเดิม — palette ไม่มี mid-gray)
          light: "#FDFDFD", // White — base surface
          surface: "#F3F3F4", // Platinum — alternating sections, newsletter band
          household: {
            DEFAULT: "#F5EFE6",
            accent: "#B08D57",
          },
          skincare: {
            DEFAULT: "#EEF3F4",
            accent: "#6E9A9E",
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
