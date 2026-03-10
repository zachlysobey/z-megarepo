# z-megarepo

A personal development platform and monorepo for experimenting with
cloud-native technologies, infrastructure-as-code, and modern development
practices.

## Repository structure

```text
z-megarepo/
├── architecture-tests/     # Architectural fitness tests (Jest + ts-jest)
├── book-reports/           # Marp markdown slideshows
├── docs/                   # Conventions and reference documentation
├── personal-mobile-app/    # Expo/React Native mobile app
├── personal-webapp/        # Next.js + React 19 + TypeScript
└── project-templates/      # Scaffolding templates for new projects
```

Application subdirectories are self-contained Node subprojects with their
own `package.json`, `.nvmrc`, and CI workflow.

## Getting started

Each subproject manages its own Node.js version via `.nvmrc`. To work in a
subproject:

```bash
cd <subproject>
nvm use
npm install
```

## Documentation

- [Vision](./docs/vision.md) — platform goals and technical direction
- [Engineering Principles](./docs/engineering-principles.md) — technical
  philosophy and standards
- [Development Process](./docs/development-process.md) — workflow and commit
  conventions
- [Contributing](./CONTRIBUTING.md) — code style, git workflow, and
  development conventions

## License

All contents of this repository are licensed under the
[GNU General Public License v3.0 or later](./LICENSE).
