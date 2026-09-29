# @nokgridcore/cli

Theme [`@nokgridcore/ui`](https://www.npmjs.com/package/@nokgridcore/ui) with your own design tokens. Your designers set values in Tokens Studio; this turns their export into one CSS file that every NokGrid component follows, in light and dark.

## How it works

1. **Designers** start from the NokGrid Tokens Studio file and change the **values**: colours, fonts, spacing, radius. They keep the token **names** and the three sets (`primitive tokens/mode`, `semantic tokens/light`, `semantic tokens/dark`). Palette names are yours to change: `NokFlame` can become `Ocean`, as long as the semantic tokens point at it.
2. **Developers** export the file from Tokens Studio and run, from your project:

   ```sh
   npx @nokgridcore/cli theme ./tokens/brand.json
   ```

   This writes `nokgrid-theme.css`.
3. Import it once, **after** NokGrid's stylesheet:

   ```tsx
   import '@nokgridcore/ui/styles.css';
   import './nokgrid-theme.css';
   ```

When the designers change a value, export again and re-run the command. Saving it as a script makes that one step:

```json
"scripts": { "theme": "nokgrid theme ./tokens/brand.json" }
```

## Options

| Option            | Default             | What it does                                                        |
| ----------------- | ------------------- | ------------------------------------------------------------------- |
| `--out <file>`    | `nokgrid-theme.css` | Where to write the CSS.                                             |
| `--prefix <name>` | `nok`               | Name your CSS variables `--<name>-…` instead of `--nok-…`.          |
| `--strict`        | off                 | Exit with an error if any NokGrid token is missing. Useful in CI.   |

### Your own prefix

With `--prefix acme`, the file defines `--acme-color-background-surface` and so on for your own code to use, and maps NokGrid's names onto them (`--nok-color-background-surface: var(--acme-color-background-surface)`) so the components follow too. Both always show the same value.

## Checks

The command checks your file against the version of NokGrid installed in your project:

- **Missing tokens** are listed. Components fall back to NokGrid's default value for those, so nothing breaks, but that part won't be in your brand. Use `--strict` to make this an error.
- **Tokens with no dark value** are listed. Dark mode falls back to NokGrid's default for those.
- **Broken references**, such as a semantic token pointing at a palette shade that was renamed or deleted, stop the build and name the token to fix.

## Requirements

Node 18 or later. The file must be a single-file Tokens Studio export.

If you install the CLI with pnpm 10 or later, pnpm may report "Ignored build scripts: style-dictionary". It's safe to ignore: the skipped script does nothing for installed copies, and the theme output is identical either way.

## License

MIT
