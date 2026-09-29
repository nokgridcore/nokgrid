# @nokgridcore/tokens

Design tokens for the NokGridCore design system: colour, typography, spacing and radius, with light and dark themes. Generated from the NokGridCore Figma library. See every token's live value in the [Storybook](https://nokgrid-ui.vercel.app/) under Foundations.

If you're using the React components in [`@nokgridcore/ui`](https://www.npmjs.com/package/@nokgridcore/ui), you don't need to install this separately. It comes with them, and `@nokgridcore/ui/styles.css` already includes the tokens. Install this package directly when you want the tokens without the components.

Want NokGrid's components in your own brand instead? Use [`@nokgridcore/cli`](https://www.npmjs.com/package/@nokgridcore/cli) to build a theme from your team's Tokens Studio file.

## Install

```sh
pnpm add @nokgridcore/tokens
# or
npm install @nokgridcore/tokens
```

## CSS variables

Import the CSS files once, at the root of your app:

```js
import '@nokgridcore/tokens/css/primitives.css';
import '@nokgridcore/tokens/css/semantic-light.css';
import '@nokgridcore/tokens/css/semantic-dark.css';
```

Then use the variables anywhere in your CSS:

```css
.panel {
	background: var(--nok-color-background-surface);
	color: var(--nok-color-text-primary);
	border: 1px solid var(--nok-color-border-default);
}
```

- **Primitives** (`primitives.css`) are the raw palette and scales, such as `--nok-color-nokflame-500`.
- **Semantic tokens** (`semantic-*.css`) describe a purpose, such as `--nok-color-background-canvas` or `--nok-color-action-primary-default`. Use these in your UI so light and dark themes work automatically.

### Dark mode

Set `data-theme="dark"` on any element. The semantic tokens inside it switch to their dark values:

```html
<html data-theme="dark">
```

## Tailwind CSS (v3)

Add the tokens to your Tailwind theme:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';

export default {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: nokTailwindTheme,
	},
} satisfies Config;
```

This gives you classes like `bg-background-canvas`, `text-text-primary` and `rounded-md` backed by the tokens. You still need to import the CSS files above, since the classes reference the CSS variables.

`nokTailwindTheme.textStyles` holds the type styles (`body-md`, `label-sm`, `caption-md` and so on) as plain style objects. Tailwind ignores this key; use it from JavaScript, e.g. `style={nokTailwindTheme.textStyles['body-md']}`.

## JavaScript constants

Primitive values are also exported as constants:

```js
import { ColorNokflame500, Space4 } from '@nokgridcore/tokens';
```

## Fonts

The typography tokens use **Plus Jakarta Sans** and **Roboto**. Font files aren't included, so load them yourself (for example from Google Fonts).

## License

MIT
