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

Releases publish to npm automatically via the `functional-release`
GitHub Actions workflow, which triggers on tags named
`functional-v<version>`, verifies the tag matches `package.json`,
re-runs typecheck and tests, and runs `npm publish` using
[trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC — no token secrets; provenance attestations are generated
automatically).

To cut a release:

```bash
npm version <major|minor|patch> --no-git-tag-version
git commit -am "chore(functional): release v<version>"
git tag functional-v<version>
git push && git push origin functional-v<version>
```

One-time setup (not yet done):

1. The very first version must be published manually — npm does not
   allow trusted publishing to create a new package. From `functional/`:
   `npm login && npm publish`.
2. On npmjs.com, under the package's Settings → Trusted publisher,
   configure GitHub Actions with user `zachlysobey`, repository
   `z-megarepo`, and workflow filename `functional-release.yml`.

## Layout

One module per export, named after the export it contains, with its tests
co-located and the public surface re-exported from `index.ts`. Adding a
helper means adding `<name>.ts`, `<name>.unit.test.ts`, and one line to
`index.ts`.

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
