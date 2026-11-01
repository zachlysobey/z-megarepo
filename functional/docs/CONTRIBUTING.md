# CONTRIBUTING guide

## Setup

```bash
nvm use && npm install
```

## NPM Scripts

- `npm test` - run the test suite with Node's native test runner
- `npm run typecheck` - typecheck with `tsc --noEmit`
- `npm run build` - compile the modules to `dist/` (ESM + type
  declarations) for publishing, via `tsconfig.build.json`, which excludes
  the co-located tests

## Releasing

Merging to `master` publishes to npm. The `functional-release`
GitHub Actions workflow runs whenever `package.json` changes on
`master`. If that version is not yet on npm, it re-runs typecheck and
tests, runs `npm publish` using
[trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC — no token secrets; provenance attestations are generated
automatically), and tags the commit `functional-v<version>`.

To release, bump the version as part of your PR:

```bash
npm version <major|minor|patch> --no-git-tag-version
```

Merges that leave the version unchanged publish nothing.

One-time setup for a new package:

1. Trusted publishing cannot create a package, so publish once manually
   from `functional/`: `npm login && npm publish`.
2. On npmjs.com, under the package's Settings → Trusted publisher,
   configure GitHub Actions with user `zachlysobey`, repository
   `z-megarepo`, and workflow filename `functional-release.yml`.

## Layout

Sources live in `src/`: one module per export, named after the export it
contains, with its tests co-located and the public surface re-exported
from `src/index.ts`. Adding a helper means adding `src/<name>.ts`,
`src/<name>.unit.test.ts`, and one line to `src/index.ts`.

## Notes

- Tests use `node:test` and `node:assert/strict`, executed directly from
  TypeScript via Node's type stripping — no Jest, no build step.
- Relative imports are written with `.ts` extensions; the
  `rewriteRelativeImportExtensions` compiler option rewrites them to
  `.js` on build, so the same source runs unbuilt under Node and ships as
  valid ESM.
- The `tsconfig.json` options `erasableSyntaxOnly` and
  `verbatimModuleSyntax` keep the code within what type stripping
  supports.
