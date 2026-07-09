import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        everfit: {
          wine: "var(--everfit-wine)",
          "wine-dark": "var(--everfit-wine-dark)",
          orange: "var(--everfit-orange)",
          cream: "var(--everfit-cream)",
          "cream-dark": "var(--everfit-cream-dark)",
          charcoal: "var(--everfit-charcoal)",
          accent: "var(--everfit-accent)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
