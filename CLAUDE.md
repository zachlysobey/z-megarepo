# CLAUDE.md

Guidance for AI assistants working in this repository.

## Repository Overview

`z-megarepo` is a personal development monorepo for experimenting with
cloud-native technologies, infrastructure-as-code, and modern development
practices. It accelerates creating new applications, libraries, and tools
via shared scaffolding and conventions.

## Repository Structure

```text
z-megarepo/
├── architecture-tests/     # Architectural fitness tests (Jest + TypeScript)
├── docs/                   # Project documentation and conventions
│   ├── development-conventions/
│   │   ├── git/            # Git workflow and branch naming standards
│   │   ├── javascript/     # JS/TS development standards and testing guides
│   │   └── markdown/       # Markdown formatting and linting standards
│   ├── LLM-instructions.md # Instructions specifically for AI assistants
│   ├── development-process.md
│   ├── engineering-principles.md
│   └── vision.md
├── personal-mobile-app/    # Expo/React Native mobile app
├── personal-webapp/        # Next.js web application
└── project-templates/      # Scaffolding templates for new projects
    └── node-app-template/
```

## Development Mode

This project uses **dialog-driven vibe coding**: lightweight, conversational
collaboration for spikes, prototypes, and fuzzy explorations. Changes evolve
iteratively rather than from full specs upfront.

Workflow loop:

1. Frame intent (a quick goal + guardrails, even a paragraph in `__drafts__/`)
2. Conversational build with rapid iteration
3. Micro-checkpoints to stay coherent
4. Stabilize once solution feels "real"

## Engineering Principles

- Collaboration produces the best outcomes
- Less is more (don't be too clever)
- Testing and documentation are not afterthoughts
- You are responsible for your dependencies
- Make changes that are small and iterative
- Always be refactoring; pay down tech debt continuously
- Defaults over config; prioritize value

## Git Conventions

- **Primary branch**: `master` (not `main`)
- **Workflow**: trunk-based development; all changes up-to-date with `master`
- **Merging**: use `merge` (not squash or rebase) when merging PRs
- **Commit scopes**: `docs`, `chore`, `red`, `green`, `refactor`

## Code Style

- **No comments** (except JSDoc-style for types/APIs)
- Concise, direct code
- Minimal changes preferred; avoid whitespace-only edits
- No `default` exports — use named exports only
- One named export per file
- File name must exactly match the export name
  (e.g., `myHelper.js` exports `myHelper`)
- Always prepend `node:` to Node.js core library imports
  (e.g., `import fs from 'node:fs'`)
- Prefer async/await with promise-based APIs over synchronous versions

## Markdown

- Follow markdownlint rules for all `.md` files
- Run `npx markdownlint "**/*.md"` to validate; use `--fix` for auto-fixable
- See [linting guide](./docs/development-conventions/markdown/linting-guide.md)

## Subprojects

Each subproject is self-contained with its own `package.json`, Node.js
version (`.nvmrc`), and CI workflow.

### `personal-webapp/`

Next.js 16 + React 19 + TypeScript web application.

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:component   # Component tests only
npm run test:coverage    # All tests with coverage
```

### `personal-mobile-app/`

Expo/React Native mobile application.

```bash
npm start                # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web
```

### `architecture-tests/`

Architectural fitness tests validating structural constraints across the
monorepo. Runs on every push via CI.

```bash
npm test                 # Run all architecture tests
```

### `project-templates/node-app-template/`

Minimal Node.js app scaffold. Copy `skeleton/` into a new directory and
replace placeholder values in `package.json` and `README.md`.

## Testing Conventions

- **Framework**: Jest (with `ts-jest` for TypeScript)
- **File naming by type** (co-located with source):
  - `moduleName.unit.test.ts` — pure unit tests
  - `ComponentName.component.test.tsx` — React component tests
  - `apiName.api.test.ts` — API tests
  - `featureName.e2e.test.ts` — end-to-end tests
- **One test file per module**, same base name as the module
- Use `describe` and `it` (not `test`)
- `describe` block name = exported name of the unit under test
- All lowercase in `it` descriptions; avoid the word "should"
- No blank lines inside `it` blocks
- Strive for short tests with a single `expect`
- Mock external dependencies; test behavior, not implementation

## Package Management

- Use **npm** (not yarn or pnpm)
- Use `npm ci` in CI/CD pipelines
- Use **exact versions** in `package.json`
  (enforced via `.npmrc` with `save-exact=true`)
- Avoid directly editing `package.json`; use `npm install` or `npm pkg set`
- Node.js version documented in `.nvmrc` (always latest LTS)
- `.npmrc` must include `registry`, `engine-strict=true`, and `save-exact=true`

## NPM Scripts Conventions

- Optimize `npm start` for local dev (runs the dev server)
- Optimize `npm test` for local dev (comprehensive but fast set of tests)
- Use colon `:` hierarchy: `test`, `test:unit`, `test:unit:watch`,
  `test:unit:coverage`, `test:coverage`
- Keep the list of scripts small; avoid scripts only used in CI

## CI/CD

GitHub Actions workflows run on every push and on PRs to `master`:

- **architecture-tests**: runs `npm test` in `architecture-tests/`
- **personal-webapp-ci**: runs lint, tests with coverage, and Next.js build
- **personal-mobile-app-ci**: runs Expo config validation

## Cursor Slash Commands

- `/status` — generate a human-readable project status report
  (git context, uncommitted changes, analysis)

## Key Documentation

- [Vision](./docs/vision.md) — platform goals
- [Development Process](./docs/development-process.md) — workflow and commit
- [Engineering Principles](./docs/engineering-principles.md) — philosophy
- [LLM Instructions](./docs/LLM-instructions.md) — AI-specific code style
- [JavaScript Conventions](./docs/development-conventions/javascript/README.md)
- [Git Conventions](./docs/development-conventions/git/README.md)
- [Markdown Conventions](./docs/development-conventions/markdown/README.md)
