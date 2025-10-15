# JavaScript Development Conventions

## Node.js & Package Management

### Node Version Management

- Use NVM for Node.js version management
- Specify Node version in `.nvmrc` file
- Use LTS versions (currently 18.x or 20.x)
- Document required Node version in README

### Package Management

- Use npm (not yarn/pnpm) for consistency
- Include `.npmrc` with standard configurations
- Use exact versions in package.json for critical dependencies
- Use `npm ci` in CI/CD pipelines

### Package.json Scripts

Standard script naming convention:

- `dev` - Start development server
- `build` - Build for production
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Run tests with coverage
- `lint` - Run linter
- `lint:fix` - Run linter with auto-fix
- `type-check` - Run TypeScript type checking
- `clean` - Clean build artifacts
- `start` - Start production server

## TypeScript

### Configuration

- Use strict TypeScript configuration
- Enable all strict flags
- Use consistent tsconfig.json across packages
- Prefer interfaces over types for object shapes

### Naming Conventions

- PascalCase for components, interfaces, types
- camelCase for functions, variables, methods
- UPPER_SNAKE_CASE for constants
- kebab-case for file names (except components)

## Testing

### Framework & Tools

- Jest for unit testing
- React Testing Library for React components
- Supertest for API testing
- Coverage threshold: 70% minimum

### Test Structure

- Co-locate tests with source files
- Use `.test.ts` or `.test.tsx` suffix
- Group related tests with `describe` blocks
- Use descriptive test names

### JavaScript Test Organization

```text
js/packages/app/src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts
└── __tests__/
    └── integration/
        └── app.test.ts
```

## Code Style

### ESLint Configuration

- Use @backstage/eslint-config for Backstage projects
- Extend with additional rules as needed
- Auto-fix on save in development

### Prettier Configuration

- Use consistent formatting rules
- Integrate with ESLint
- Format on save

### Import Organization

1. Node modules
2. Internal modules (absolute imports)
3. Relative imports
4. Type-only imports last

## File Structure

### JavaScript Monorepo Structure

```text
project/
├── js/
│   ├── packages/
│   │   ├── app/
│   │   ├── backend/
│   │   └── shared/
│   ├── plugins/
│   └── tools/
├── docs/
└── [other-language-dirs]/
```

### JavaScript Component Structure

```text
js/packages/app/src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
├── index.ts
└── types.ts
```

## Git & Version Control

### Commit Messages

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Refactoring

## Environment & Configuration

### Environment Variables

- Use `.env.example` for required variables
- Document all environment variables
- Use consistent naming (UPPER_SNAKE_CASE)
- Validate required variables at startup

### Configuration Files

- Use consistent naming: `config.ts`, `config.json`
- Validate configuration on startup
- Use environment-specific configs when needed

## Documentation

### README Requirements

- Project description and purpose
- Prerequisites and setup instructions
- Development workflow
- Testing instructions
- Deployment information

### Code Documentation

- JSDoc for public APIs
- Inline comments for complex logic
- Architecture decisions in ADR format

## Security

### Dependencies

- Regular security audits with `npm audit`
- Pin critical dependency versions
- Use `package-lock.json` for reproducible builds

### Secrets Management

- Never commit secrets to version control
- Use environment variables for sensitive data
- Document required secrets in `.env.example`
