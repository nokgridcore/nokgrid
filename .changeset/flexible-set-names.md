---
"@nokgridcore/tokens": patch
"@nokgridcore/cli": patch
---

Token sets are now matched by role instead of exact name, so real Tokens Studio exports work as-is: Figma's default "Mode 1" mode name and collection names like "Theme - semantic tokens" are accepted. The CLI prints which sets it read.
