# @nokgridcore/ui

React components for the NokGridCore design system. Styled with the design tokens from [`@nokgridcore/tokens`](https://www.npmjs.com/package/@nokgridcore/tokens), with light and dark themes built in.

**[Browse every component in the Storybook](https://nokgrid-ui.vercel.app/)** · **[Full installation guide](https://nokgrid-ui.vercel.app/?path=/docs/getting-started-installation-for-developers--docs)**

## Install

```sh
pnpm add @nokgridcore/ui
# or
npm install @nokgridcore/ui
```

Requires **React 19** (`react` and `react-dom` are peer dependencies).

## Setup

Import the stylesheet once, at the root of your app:

```tsx
import '@nokgridcore/ui/styles.css';
```

It contains the design tokens (as CSS variables) and every style the components use. You don't need to set up Tailwind yourself.

> **Note:** the stylesheet includes a base reset (Tailwind's Preflight). It removes default margins and browser styling from elements like headings, lists and buttons across the whole page. In an existing app, check your own pages still look right after adding it.

### Fonts

The components use **Plus Jakarta Sans** and **Roboto**. The package doesn't bundle font files, so load them yourself, for example from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
	rel="stylesheet" />
```

## Usage

Each component has its own import path:

```tsx
import { Button } from '@nokgridcore/ui/button';
import { Select } from '@nokgridcore/ui/select';
import { Option } from '@nokgridcore/ui/option';

export function Example() {
	return (
		<>
			<Button variant='primary' size='md' icon='Plus' iconPosition='left'>
				New project
			</Button>

			<Select label='Region' placeholder='Select a region'>
				<Option label='Europe' />
				<Option label='North America' />
			</Select>
		</>
	);
}
```

Components are fully typed. Props, variants and icon names autocomplete in your editor.

### Dark mode

Set `data-theme="dark"` on any element. Everything inside it switches to the dark theme:

```html
<html data-theme="dark">
```

Remove the attribute to go back to light.

### Your own brand

To give the components your team's colours, fonts and spacing, build a theme from your Tokens Studio file with [`@nokgridcore/cli`](https://www.npmjs.com/package/@nokgridcore/cli) and import it after the stylesheet:

```tsx
import '@nokgridcore/ui/styles.css';
import './nokgrid-theme.css'; // from: npx @nokgridcore/cli theme ./tokens/brand.json
```

The [product teams guide](https://nokgrid-ui.vercel.app/?path=/docs/getting-started-installation-for-product-teams--docs) covers the whole setup, from Figma to the app.

### Icons

```tsx
import { Icon } from '@nokgridcore/ui/icon';

<Icon name='AlertCircle' size='md' />;
```

Components that take an `icon` prop accept the same names.

### Next.js

Interactive components are marked `'use client'`, so they work in the App Router, including when imported from Server Components.

## Components

| Category          | Import paths                                                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input & control   | `button`, `input`, `textarea`, `search-input`, `select`, `option`, `checkbox`, `radio`, `toggle`, `chip`                                                                           |
| Data display      | `badge`, `badge-count`, `status-dot`, `avatar`, `kpi`, `card`, `divider`, `icon`, `legend`, `skeleton`, `tooltip`, `tooltip-row`                                                   |
| Progress          | `progress`, `progress-stepped`, `segment`                                                                                                                                          |
| Table             | `table`, `table-row`, `table-cell`, `table-header-cell`, `table-toolbar`                                                                                                           |
| Feedback & overlay | `alert`, `toast`, `modal`, `modal-header`, `modal-body`, `modal-footer`, `popover`                                                                                                 |
| Navigation        | `tab`, `tab-group`, `menu`, `menu-item`, `pagination`, `pagination-button`, `breadcrumb`, `breadcrumb-item`, `top-bar`, `sidebar`, `sidebar-header`, `sidebar-content`, `sidebar-group`, `sidebar-footer` |
| Date              | `calendar`, `calendar-day`, `calendar-picker`, `calendar-picker-cell`                                                                                                              |
| Charts            | `chart-frame`, `chart-bar`, `chart-bar-stack`, `chart-bar-segment`, `chart-line`, `chart-line-series`, `chart-donut`, `chart-donut-segment`, `chart-spark`                          |

Import any of them as `@nokgridcore/ui/<path>`.

## License

MIT
