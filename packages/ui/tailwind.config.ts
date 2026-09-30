import type { Config } from "tailwindcss";
import { nokTailwindTheme } from "@nokgridcore/tokens/tailwind-theme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      ...nokTailwindTheme,
      // Press feedback: buttons scale to 0.96 while held.
      scale: { press: '0.96' },
    },
  },
  plugins: [],
} satisfies Config;
