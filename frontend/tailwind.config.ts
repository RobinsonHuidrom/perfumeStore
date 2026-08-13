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
        obsidian: {
          900: "#0A0A0C",
          800: "#121215",
          700: "#1A1A1E",
          600: "#26262C",
        },
        gold: {
          400: "#F3E5AB",
          500: "#D4AF37",
          600: "#C5A059",
          700: "#9A7B38",
        },
        cream: {
          50: "#FCFCFA",
          100: "#F5F5F0",
          200: "#EBEBE3",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Inter", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
