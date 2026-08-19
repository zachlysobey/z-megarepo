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

## Notes

- Tests use `node:test` and `node:assert/strict`, executed directly from
  TypeScript via Node's type stripping — no Jest, no build step.
- The `tsconfig.json` options `erasableSyntaxOnly` and
  `verbatimModuleSyntax` keep the code within what type stripping
  supports.
