---
"@nokgridcore/tokens": minor
---

- The token conversion and CSS build are now exported (`@nokgridcore/tokens/lib/convert`, `@nokgridcore/tokens/lib/css`) and shared with `@nokgridcore/cli`, so team themes are generated exactly like NokGrid's own.
- Fix: dark-mode typography tokens used different names from light (`…-fontFamily` instead of `…-font-family`), so dark typography values never applied. Light and dark now use the same names.
- A token that points at a token that doesn't exist now fails with the token's name, instead of a generic reference error.
