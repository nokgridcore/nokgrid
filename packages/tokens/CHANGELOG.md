# @nokgridcore/tokens

## 0.2.2

### Patch Changes

- 2982f6f: Fix: themes from Tokens Studio files that export sizes as plain numbers (Figma's pixel values, `$type: "number"`) came out unitless (`padding: 12`), which browsers ignore, so components lost all spacing, sizes and radii. Numbers in size groups (space, spacing, size, radius, font size, line height) are now converted to rem, the same way NokGrid's own tokens are stored.

## 0.2.1

### Patch Changes

- 7716774: Token sets are now matched by role instead of exact name, so real Tokens Studio exports work as-is: Figma's default "Mode 1" mode name and collection names like "Theme - semantic tokens" are accepted. The CLI prints which sets it read.

## 0.2.0

### Minor Changes

- f470d84: - The token conversion and CSS build are now exported (`@nokgridcore/tokens/lib/convert`, `@nokgridcore/tokens/lib/css`) and shared with `@nokgridcore/cli`, so team themes are generated exactly like NokGrid's own.
  - Fix: dark-mode typography tokens used different names from light (`…-fontFamily` instead of `…-font-family`), so dark typography values never applied. Light and dark now use the same names.
  - A token that points at a token that doesn't exist now fails with the token's name, instead of a generic reference error.
