# Changesets

Each change to a published package (`@nokgridcore/tokens`, `@nokgridcore/ui`) gets a short changeset note.

1. After making a change, run `pnpm changeset`. Pick the package(s), the bump type (patch = fix, minor = new feature, major = breaking change), and write one line describing it. Commit the generated file with your change.
2. To cut a release, run `pnpm version-packages`. This bumps versions and writes each package's `CHANGELOG.md` from the notes. Commit the result.
3. Run `pnpm release` to build and publish to npm.
