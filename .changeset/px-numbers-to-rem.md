---
"@nokgridcore/tokens": patch
"@nokgridcore/cli": patch
---

Fix: themes from Tokens Studio files that export sizes as plain numbers (Figma's pixel values, `$type: "number"`) came out unitless (`padding: 12`), which browsers ignore, so components lost all spacing, sizes and radii. Numbers in size groups (space, spacing, size, radius, font size, line height) are now converted to rem, the same way NokGrid's own tokens are stored.
