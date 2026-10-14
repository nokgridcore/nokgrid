# @nokgridcore/cli

## 0.2.1

### Patch Changes

- 7716774: Token sets are now matched by role instead of exact name, so real Tokens Studio exports work as-is: Figma's default "Mode 1" mode name and collection names like "Theme - semantic tokens" are accepted. The CLI prints which sets it read.
- Updated dependencies [7716774]
  - @nokgridcore/tokens@0.2.1

## 0.2.0

### Minor Changes

- f470d84: New: `npx @nokgridcore/cli theme ./tokens/brand.json` builds a CSS theme for `@nokgridcore/ui` from a team's Tokens Studio export. It checks the file against the installed NokGrid version, lists missing tokens and tokens without a dark value, and supports a custom variable prefix with `--prefix`.

### Patch Changes

- Updated dependencies [f470d84]
  - @nokgridcore/tokens@0.2.0
