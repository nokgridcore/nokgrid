# Contributing to NokGridCore

## Setup

Requires Node 18+ and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/nokgridcore/nokgrid.git
cd nokgrid
pnpm install
pnpm tokens                                  # build the design tokens
pnpm --filter @nokgridcore/ui storybook      # http://localhost:6006
```

Storybook is where components are built and reviewed.

## Repository layout

```
packages/
  ui/                 React components and their Storybook
  tokens/             Design tokens and the build that turns them into CSS/JS
                      (lib/ holds the conversion and CSS build, shared with cli/)
  cli/                The `nokgrid theme` command teams use to build their own theme
  eslint-config/      Shared lint config (internal)
  typescript-config/  Shared TypeScript config (internal)
apps/
  web/, docs/         Next.js sandbox apps (internal, not published)
```

## Commands

Run from the repo root:

```bash
pnpm build         # build all packages
pnpm lint          # lint all packages
pnpm check-types   # type-check all packages
```

## Updating the design tokens

The tokens come from the Figma library via the Tokens Studio plugin:

1. Export the tokens from Tokens Studio as JSON and save the file as `packages/tokens/tokens.raw.json`.
2. Run `pnpm tokens`. This regenerates the CSS, Tailwind theme and JS output.
3. Check the result in Storybook (Foundations pages), then commit.

## Adding a component

1. Build it in `packages/ui/src/<name>/`, using semantic tokens only (no raw colours, sizes or spacing).
2. Add a story, `<name>.stories.tsx`, next to it.
3. Add the component to **both** export maps in `packages/ui/package.json`:
   - `exports`: points at the source file, used inside this repo.
   - `publishConfig.exports`: points at the compiled `dist/` files, used by the published package.

   Missing the second one means the component builds fine here but can't be imported by anyone installing from npm.

## Releasing

Versioning uses [changesets](https://github.com/changesets/changesets).

1. With each change to a published package, run `pnpm changeset`. Pick the package(s), the bump type (patch = fix, minor = new feature, major = breaking change), and write one line describing it. Commit the generated file with your change.
2. To cut a release, run `pnpm version-packages`. This bumps versions and writes each package's `CHANGELOG.md`. Commit the result.
3. Run `pnpm release` to build and publish to npm.

**On Windows**, pnpm may end the publish with `EBUSY: resource busy or locked, rmdir ...Temp...`. This is Windows blocking pnpm from deleting its temp folder *after* the upload. Check npm (`npm view @nokgridcore/ui version`) before assuming the release failed. A Windows Defender exclusion for your Temp folder stops it.
