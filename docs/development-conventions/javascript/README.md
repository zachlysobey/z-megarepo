# JavaScript Development Conventions

## Node.js & Package Management

### Node Version Management

- Use NVM for Node.js version management
- Specify Node version in `.nvmrc` file
- Use LTS versions (i.e. `lts/jod`)

### Package Management

- Use npm (not yarn/pnpm) for consistency
- Include `.npmrc` with standard configurations
- Use exact versions in package.json for critical dependencies
- Use `npm ci` in CI/CD pipelines

## Testing

see the JavaScript [testing guide](./testing-guide.md).
