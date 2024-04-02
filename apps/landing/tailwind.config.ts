import path from 'path';
import type { Config as TailwindConfig } from 'tailwindcss';
import { default as uiTailwindConfig } from "@makify/ui/tailwind.config"

const config: TailwindConfig = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Makify ui components
    path.join(path.dirname(require.resolve("@makify/ui")), "components/**/*.{ts,tsx}")
  ],
  theme: {
    ...uiTailwindConfig.theme
  },
  plugins: [
    ...uiTailwindConfig.plugins
  ],
};

export default config;