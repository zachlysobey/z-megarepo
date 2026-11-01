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

Every merged PR that touches this package publishes it to npm via the
`functional-release` workflow, with the version bump taken from the PR
title. See
[Publishing npm packages](../../docs/development-conventions/javascript/publishing-npm-packages.md).

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
