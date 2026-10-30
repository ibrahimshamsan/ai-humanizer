import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2F8FE",
          100: "#C0E6FD",
          200: "#80AAD3",
          300: "#5B86B6",
          400: "#3F6593",
          500: "#1B3554",
          600: "#000F22",
        },
        primary: {
          DEFAULT: "#3F6593",
          hover: "#1B3554",
          soft: "#EAF3FC",
        },
        surface: "#FFFFFF",
        canvas: "#F6FAFD",
        ink: {
          DEFAULT: "#000F22",
          muted: "#5B86B6",
          subtle: "#80AAD3",
        },
        line: "#DCE7F2",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-cairo)",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0, 15, 34, 0.04), 0 4px 14px rgba(0, 15, 34, 0.05)",
        lift: "0 10px 34px rgba(0, 15, 34, 0.09)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
