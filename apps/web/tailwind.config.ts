import type { Config } from "tailwindcss";
import { nokTailwindTheme } from "@nokgridcore/tokens/tailwind-theme";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: nokTailwindTheme,
  },
  plugins: [],
} satisfies Config;
