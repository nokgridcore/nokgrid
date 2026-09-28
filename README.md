# NokGridCore

An open-source design system: design tokens and React components, built from the NokGridCore Figma library.

## Packages

| Package                                     | What it is                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| [`@nokgridcore/ui`](packages/ui)            | React components with light and dark themes. Most people only need this one.      |
| [`@nokgridcore/tokens`](packages/tokens)    | Design tokens as CSS variables, a Tailwind theme and JavaScript constants.        |

To use the design system in your app, see the [`@nokgridcore/ui` README](packages/ui/README.md).

## Repository layout

```
packages/
  ui/                 React components and the Storybook for them
  tokens/             Design tokens and the build that turns them into CSS/JS
  eslint-config/      Shared lint config (internal)
  typescript-config/  Shared TypeScript config (internal)
apps/
  web/, docs/         Next.js sandbox apps (internal, not published)
```

## Development

Requires Node 18+ and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm tokens                                  # build the design tokens
pnpm --filter @nokgridcore/ui storybook      # component workshop at http://localhost:6006
```

Storybook is where components are built and reviewed. It also has the Getting Started and Foundations docs.

Other commands, run from the repo root:

```sh
pnpm build         # build all packages
pnpm lint          # lint all packages
pnpm check-types   # type-check all packages
```

### Updating the design tokens

The tokens come from the Figma library via the Tokens Studio plugin:

1. Export the tokens from Tokens Studio as JSON and save the file as `packages/tokens/tokens.raw.json`.
2. Run `pnpm tokens`. This regenerates the CSS, Tailwind theme and JS output.
3. Check the result in Storybook (Foundations pages), then commit.

## Releasing

Versioning uses [changesets](https://github.com/changesets/changesets). In short:

1. With each change to a published package, run `pnpm changeset` and describe the change.
2. To release, run `pnpm version-packages`, commit, then run `pnpm release`.

See [.changeset/README.md](.changeset/README.md) for details.

## License

[MIT](LICENSE)
