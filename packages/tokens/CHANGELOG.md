# @nokgridcore/tokens

## 0.2.1

### Patch Changes

- 7716774: Token sets are now matched by role instead of exact name, so real Tokens Studio exports work as-is: Figma's default "Mode 1" mode name and collection names like "Theme - semantic tokens" are accepted. The CLI prints which sets it read.

## 0.2.0

### Minor Changes

- f470d84: - The token conversion and CSS build are now exported (`@nokgridcore/tokens/lib/convert`, `@nokgridcore/tokens/lib/css`) and shared with `@nokgridcore/cli`, so team themes are generated exactly like NokGrid's own.
  - Fix: dark-mode typography tokens used different names from light (`…-fontFamily` instead of `…-font-family`), so dark typography values never applied. Light and dark now use the same names.
  - A token that points at a token that doesn't exist now fails with the token's name, instead of a generic reference error.
