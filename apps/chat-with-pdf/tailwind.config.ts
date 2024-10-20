import path from "path";
import type { Config as TailwindConfig } from "tailwindcss";
import { default as uiTailwindConfig } from "@makify/ui/tailwind.config";

const config: TailwindConfig = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Makify ui components
    path.join(
      path.dirname(require.resolve("@makify/ui")),
      "components/**/*.{ts,tsx}",
    ),
  ],
  presets: [uiTailwindConfig],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-10px)",
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(10px)",
          },
        },
      },
      animation: {
        shake: "shake 0.6s ease-in-out 0.25s 1",
      },
    },
  },
  plugins: [],
};

export default config;
