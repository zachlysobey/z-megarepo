# JavaScript Development Conventions

## Use the Templates

`z-megarepo` includes a `project-templates/` directory which includes common scaffolding which codifies our best practices. Rather than re-creating boilerplate from scratch each time, use the templates!

## Node.js & Package Management

### Node Version Management

see the [Node.js Version Management Guide](./node-version-management-guide.md)

### Package Management

- Use npm (not yarn/pnpm) for consistency
- Include `.npmrc` with standard configurations (see [Guidance for the `.npmrc` File](./npmrc-guidance.md))
- Use `npm ci` in CI/CD pipelines
- Use exact versions in package.json for dependencies

## Testing

see the JavaScript [testing guide](./testing-guide.md).
