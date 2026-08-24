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
        'brand-blue': '#0a2a43', // Deep blue from the design
        'brand-light-blue': '#8dbbd1',
        'brand-text': '#f0f4f8'
      },
      fontFamily: {
        'heading': ['var(--font-heygotcha)', 'sans-serif'],
        'body': ['var(--font-canvasans)', 'sans-serif'],
      },
      backgroundImage: {
        'silk-texture': "url('/placeholder-texture.jpg')",
      }
    },
  },
  plugins: [],
};
export default config;
