import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary-color)", // Custom root color
        secondary: "var(--secondary-color)",
        light_green: "var(--green-light)",
        light: "var(--light)",
        dark: "var(--dark)",
      },
      fontFamily: {
        sans: ["Red Hat Display", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
