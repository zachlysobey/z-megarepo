# JavaScript Development Conventions

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
