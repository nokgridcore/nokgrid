import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { nokTailwindTheme } from "@nokgridcore/tokens/tailwind-theme";

const require = createRequire(import.meta.url);

// Primitive space scale (--nok-space-*), keyed like Tailwind's own scale so
// `gap-12` / `py-24` resolve to the token instead of a Tailwind default.
const spaceKeys: Record<string, string> = {
  "0": "0",
  px: "px",
  "0.5": "half",
  "1": "1",
  "1.5": "1-5",
  "2": "2",
  "2.5": "2-5",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "8": "8",
  "9": "9",
  "10": "10",
  "11": "11",
  "12": "12",
  "14": "14",
  "16": "16",
  "20": "20",
  "24": "24",
  "32": "32",
  "60": "60",
};
const space = Object.fromEntries(
  Object.entries(spaceKeys).map(([key, token]) => [
    key,
    `var(--nok-space-${token})`,
  ]),
);

// Typography composites (display/heading/body/label/caption/mono) only exist as
// CSS variables, so the `text-style-*` utilities are generated from the token
// stylesheet itself — adding a style in Tokens Studio adds a utility here.
// Token weights are keywords ("semibold"); CSS needs the numeric equivalent.
const fontWeightKeyword: Record<string, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};
const semanticCss = readFileSync(
  require.resolve("@nokgridcore/tokens/css/semantic-light.css"),
  "utf8",
);
const textStyles = Object.fromEntries(
  [
    ...semanticCss.matchAll(
      /--nok-typography-([a-z0-9-]+)-font-weight:\s*([a-z]+);/g,
    ),
  ].map(([, name, weight]) => [
    `.text-style-${name}`,
    {
      fontFamily: `var(--nok-typography-${name}-font-family)`,
      fontSize: `var(--nok-typography-${name}-font-size)`,
      lineHeight: `var(--nok-typography-${name}-line-height)`,
      fontWeight: String(fontWeightKeyword[weight!] ?? 400),
    },
  ]),
);

export default {
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  // The token dark theme is scoped to [data-theme="dark"], so `dark:` follows it.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      ...nokTailwindTheme,
      spacing: { ...nokTailwindTheme.spacing, ...space },
      // Motion values live in globals.css (--motion-*); these name them for Tailwind.
      transitionTimingFunction: {
        out: "var(--motion-ease-out)",
        emphasized: "var(--motion-ease-emphasized)",
        "in-out": "var(--motion-ease-in-out)",
      },
      transitionDuration: {
        press: "var(--motion-duration-press)",
        state: "var(--motion-duration-state)",
        icon: "var(--motion-duration-icon)",
        reveal: "var(--motion-duration-reveal)",
        rise: "var(--motion-duration-rise)",
        slide: "var(--motion-duration-slide)",
      },
      scale: {
        press: "var(--motion-scale-press)",
        "icon-out": "var(--motion-scale-icon-out)",
      },
      blur: { "icon-out": "var(--motion-blur-icon-out)" },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(textStyles);
    }),
  ],
} satisfies Config;
