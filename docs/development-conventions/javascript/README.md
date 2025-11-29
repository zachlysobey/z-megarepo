# JavaScript Development Conventions

## Use the Templates

`z-megarepo` includes a `project-templates/` directory which includes common scaffolding which codifies our best practices. Rather than re-creating boilerplate from scratch each time, use the templates!

## Module & Coding Conventions

- [JavaScript Module Conventions](./js-module-conventions.md)
- [Node.js Conventions](./nodejs-conventions.md)

## Node.js & Package Management

### Node Version Management

See the [Node.js Version Management Guide](./node-version-management-guide.md)

### Package Management

- Use npm (not yarn/pnpm) for consistency
- Include `.npmrc` with standard configurations (see [Guidance for the `.npmrc` File](./npmrc-guidance.md))
- Use `npm ci` in CI/CD pipelines
- Use exact versions in package.json for dependencies

## Testing

- [JavaScript Testing Guide](./testing-guide.md)
- [Jest Testing Style Guide](./jest-testing-style-guide.md)

## NPM Run-Scripts

- [NPM Run-Script Conventions](./npm-run-script-conventions.md)
- [NPM Run-Script Naming Conventions](./npm-run-script-naming-conventions.md)
