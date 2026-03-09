# JavaScript development conventions

## Use the templates

`z-megarepo` includes a `project-templates/` directory which includes
common scaffolding which codifies our best practices. Rather than
re-creating boilerplate from scratch each time, use the templates!

## Module & coding conventions

- [JavaScript Module Conventions](./js-module-conventions.md)
- [Node.js Conventions](./nodejs-conventions.md)

## Node.js & package management

### Node version management

See the [Node.js Version Management Guide](./node-version-management-guide.md)

### Package management

- Use npm (not yarn/pnpm) for consistency
- Include `.npmrc` with standard configurations (see
  [Guidance for the `.npmrc` File](./npmrc-guidance.md))
- Use `npm ci` in CI/CD pipelines
- Use exact versions in package.json for dependencies

## Testing

- [JavaScript Testing Guide](./testing-guide.md)
- [Jest Testing Style Guide](./jest-testing-style-guide.md)

## NPM run-scripts

- [NPM Run-Script Conventions](./npm-run-script-conventions.md)
- [NPM Run-Script Naming Conventions](./npm-run-script-naming-conventions.md)
