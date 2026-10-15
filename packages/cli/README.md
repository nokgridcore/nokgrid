# @nokgridcore/cli

Theme [`@nokgridcore/ui`](https://www.npmjs.com/package/@nokgridcore/ui) with your own design tokens. Your designers set values in Tokens Studio; this turns their file into one CSS file that every NokGrid component follows, in light and dark.

**Setting this up for a team?** The [product teams guide](https://nokgrid-ui.vercel.app/?path=/docs/getting-started-installation-for-product-teams--docs) walks designers and developers through the whole flow, from Figma to the app.

## How it works

1. **Designers** start from the NokGrid Figma file and change the **values** in Tokens Studio: colours, fonts, spacing, radius. They keep the token **names**. Palette names are theirs to change (`NokFlame` can become `Ocean`), as long as the semantic tokens point at them.
2. The file reaches your repo, either through Tokens Studio's **GitHub/Bitbucket sync** (push from Figma) or as a single-file **export**. Use the **W3C DTCG** token format.
3. **Developers** add the CLI and run it from the project:

   ```sh
   npm install -D @nokgridcore/cli
   npx nokgrid theme ./design-tokens/tokens.json
   ```

   This writes `nokgrid-theme.css`.
4. Import it once, **after** NokGrid's stylesheet:

   ```tsx
   import '@nokgridcore/ui/styles.css';
   import './nokgrid-theme.css';
   ```

### Keep it automatic

Run the command before every dev run and build, so the theme always matches the token file and nobody has to remember:

```json
"scripts": {
  "theme": "nokgrid theme design-tokens/tokens.json --out src/styles/theme.css",
  "predev": "npm run theme",
  "prebuild": "npm run theme"
}
```

With that, a designer's push from Figma reaches the app on the next build, including preview deployments on Vercel or Netlify.

## Options

| Option            | Default             | What it does                                                        |
| ----------------- | ------------------- | ------------------------------------------------------------------- |
| `--out <file>`    | `nokgrid-theme.css` | Where to write the CSS.                                             |
| `--prefix <name>` | `nok`               | Name your CSS variables `--<name>-…` instead of `--nok-…`.          |
| `--strict`        | off                 | Exit with an error if any NokGrid token is missing. Useful in CI.   |

### Your own prefix

With `--prefix acme`, the file defines `--acme-color-background-surface` and so on for your own code to use, and maps NokGrid's names onto them (`--nok-color-background-surface: var(--acme-color-background-surface)`) so the components follow too. Both always show the same value.

## What the file needs

- **One primitive set and one semantic set with a light and a dark mode.** Sets are matched by their role, not their exact name, so Figma's names (`primitive tokens/Mode 1`, `Theme - semantic tokens/light`) work as they are. The command prints which sets it read.
- **W3C DTCG format** (Tokens Studio Settings → Token format).
- Sizes can be rem values or Figma's plain pixel numbers: pixel numbers in size groups (space, spacing, size, radius, font size, line height) are converted to rem, the same way NokGrid stores them.

## Checks

The command checks your file against the version of NokGrid installed in your project:

- **Missing tokens** are listed. Components fall back to NokGrid's default value for those, so nothing breaks, but that part won't be in your brand. Use `--strict` to make this an error.
- **Tokens with no dark value** are listed. Dark mode falls back to NokGrid's default for those.
- **Broken references**, such as a semantic token pointing at a palette shade that was renamed or deleted, stop the build and name the token to fix.

## Requirements

Node 18 or later.

If you install the CLI with pnpm 10 or later, pnpm may report "Ignored build scripts: style-dictionary". It's safe to ignore: the skipped script does nothing for installed copies, and the theme output is identical either way.

## License

MIT
