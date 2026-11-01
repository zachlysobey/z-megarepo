# CONTRIBUTING guide

## Setup

```bash
nvm use && npm install
```

## NPM Scripts

- `npm test` - run the test suite with Node's native test runner
- `npm run typecheck` - typecheck with `tsc --noEmit`
- `npm run build` - compile `index.ts` to `dist/` (ESM + type
  declarations) for publishing

## Releasing

Merging to `master` publishes to npm. The `time-units-release`
GitHub Actions workflow runs whenever `package.json` changes on
`master`. If that version is not yet on npm, it re-runs typecheck and
tests, runs `npm publish` using
[trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC — no token secrets; provenance attestations are generated
automatically), and tags the commit `time-units-v<version>`.

To release, bump the version as part of your PR:

```bash
npm version <major|minor|patch> --no-git-tag-version
```

Merges that leave the version unchanged publish nothing.

One-time setup for a new package:

1. Trusted publishing cannot create a package, so publish once manually
   from `time-units/`: `npm login && npm publish`.
2. On npmjs.com, under the package's Settings → Trusted publisher,
   configure GitHub Actions with user `zachlysobey`, repository
   `z-megarepo`, and workflow filename `time-units-release.yml`.

## Notes

- Tests use `node:test` and `node:assert/strict`, executed directly from
  TypeScript via Node's type stripping — no Jest, no build step.
- The `tsconfig.json` options `erasableSyntaxOnly` and
  `verbatimModuleSyntax` keep the code within what type stripping
  supports.
