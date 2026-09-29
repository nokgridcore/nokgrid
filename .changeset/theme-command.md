---
"@nokgridcore/cli": minor
---

New: `npx @nokgridcore/cli theme ./tokens/brand.json` builds a CSS theme for `@nokgridcore/ui` from a team's Tokens Studio export. It checks the file against the installed NokGrid version, lists missing tokens and tokens without a dark value, and supports a custom variable prefix with `--prefix`.
