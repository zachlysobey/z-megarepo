# Contributing to z-megarepo

All changes should follow the [engineering principles] and
[development process].

[engineering principles]: ./docs/engineering-principles.md
[development process]: ./docs/development-process.md

## Git conventions

Use [Conventional Commits](https://www.conventionalcommits.org/).
Format: `<type>[(<scope>)]: <description>` (scope is optional)
Common types: feat, fix, docs, chore, refactor, test, ci

- **Primary branch**: `master` (not `main`)
- **Merging**: use `merge` (not squash or rebase) when merging PRs
- Trunk-based development; keep branches up-to-date with `master`

See [git conventions] for branch naming and workflow details.

[git conventions]: ./docs/development-conventions/git/README.md

## Code style

- No comments except JSDoc-style for types/APIs
- No `default` exports — use named exports only
- One named export per file; filename must match the export name
- Prepend `node:` to Node.js core imports (e.g., `import fs from 'node:fs'`)
- Prefer async/await over synchronous APIs

See [JS module conventions] and [Node.js conventions].

[JS module conventions]: ./docs/development-conventions/javascript/js-module-conventions.md
[Node.js conventions]: ./docs/development-conventions/javascript/nodejs-conventions.md

## Markdown

Follow the [Google Markdown style guide] for all `.md` files, and validate
with [markdownlint].

[Google Markdown style guide]: https://google.github.io/styleguide/docguide/style.html
[markdownlint]: ./docs/development-conventions/markdown/linting-guide.md

## Testing

- **Framework**: Jest (preset varies by subproject)
- **File naming** (co-located with source):
    - `moduleName.unit.test.ts`
    - `ComponentName.component.test.tsx`
    - `featureName.e2e.test.ts`

See [testing guide] and [Jest style guide].

[testing guide]: ./docs/development-conventions/javascript/testing-guide.md
[Jest style guide]: ./docs/development-conventions/javascript/jest-testing-style-guide.md

## Package management

- Use **npm** (not yarn or pnpm)
- Check `.nvmrc` in each subproject for the expected Node.js version
- Avoid directly editing `package.json`; use `npm install` or `npm pkg set`

See [package.json guide] and [npmrc guidance].

[package.json guide]: ./docs/development-conventions/javascript/package-json-guide.md
[npmrc guidance]: ./docs/development-conventions/javascript/npmrc-guidance.md
