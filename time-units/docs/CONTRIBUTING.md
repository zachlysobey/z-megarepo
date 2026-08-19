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

Releases publish to npm automatically via the `time-units-release`
GitHub Actions workflow, which triggers on tags named
`time-units-v<version>`, verifies the tag matches `package.json`,
re-runs typecheck and tests, and runs `npm publish` using
[trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC — no token secrets; provenance attestations are generated
automatically).

To cut a release:

```bash
npm version <major|minor|patch> --no-git-tag-version
git commit -am "chore(time-units): release v<version>"
git tag time-units-v<version>
git push && git push origin time-units-v<version>
```

One-time setup (not yet done):

1. The very first version must be published manually — npm does not
   allow trusted publishing to create a new package. From `time-units/`:
   `npm login && npm publish`.
2. On npmjs.com, under the package's Settings → Trusted publisher,
   configure GitHub Actions with user `zachlysobey`, repository
   `z-megarepo`, and workflow filename `time-units-release.yml`.

## Notes

- Tests use `node:test` and `node:assert/strict`, executed directly from
  TypeScript via Node's type stripping — no Jest, no build step.
- The `tsconfig.json` options `erasableSyntaxOnly` and
  `verbatimModuleSyntax` keep the code within what type stripping
  supports.
