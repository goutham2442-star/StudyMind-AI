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
        primary: "#4F8EF7",
        secondary: "#7C3AED",
        dark: "#0A0A0F",
        surface: "#111118",
        surface2: "#1A1A27",
        border: "#1E1E2E",
        background: "#0A0A0F",
        foreground: "#F1F5F9",
        muted: "#94A3B8",
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        dmSans: ["var(--font-dm-sans)", "sans-serif"],
      },
      screens: {
        xs: "375px",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
