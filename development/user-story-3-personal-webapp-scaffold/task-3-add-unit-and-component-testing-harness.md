# Task 3: Add Unit & Component Testing Harness

## Technical Approach

- Install and configure Jest as the test runner for the Next.js application
- Set up React Testing Library for component testing
- Configure TypeScript support for tests
- Add test scripts to package.json following project conventions
- Set up test coverage reporting
- Configure Jest to work with Next.js App Router and module resolution
- Create example tests to validate the setup

## LLM Prompts Needed

### Prompt 1: Install and Configure Jest with React Testing Library

```text
Set up Jest with separate configurations for unit and component tests:
- Install Jest for the test runner
- Install @testing-library/react, @testing-library/jest-dom, and @testing-library/user-event for component testing
- Install jest-environment-jsdom for DOM testing (component tests only)
- Create a jest.config.js file using Jest projects configuration (https://jestjs.io/docs/configuration#projects-arraystring--projectconfig):
  - Define two separate Jest projects in the config:
    - **Unit test project**: 
      - Matches *.unit.test.{js,ts} files
      - Uses node test environment (no React/DOM dependencies)
      - For testing plain JavaScript/TypeScript functions and modules
    - **Component test project**: 
      - Matches *.component.test.{jsx,tsx} files
      - Uses jsdom test environment
      - Configured with React Testing Library setup
      - For testing React components
  - Both projects should:
    - Configure module name mapping for Next.js aliases (@/ paths)
    - Set up coverage collection from app/ and components/ directories
    - Exclude node_modules, .next, and build artifacts
- Create a jest.setup.js file that imports @testing-library/jest-dom (used only by component test project)
- Update package.json with test scripts:
  - `test:unit` - Run unit tests only (*.unit.test.{js,ts} files)
  - `test:component` - Run component tests only (*.component.test.{jsx,tsx} files)
  - `test:all` - Run all tests (runs `jest`)
  - `test` - Run all tests (runs `jest`)
  - `test:coverage` - Run all tests with unified coverage report (jest --coverage)
- Verify the configurations work by running the test commands
```

### Prompt 2: Create Example Tests and Update CI

```text
Create example tests to validate the testing setup and update CI workflow:
- Create a simple utility function with a unit test (e.g., lib/example.ts and lib/example.unit.test.ts)
- Create a simple React component with a component test (e.g., components/example.tsx and components/example.component.test.tsx)
- Follow the testing conventions from docs/development-conventions/javascript/testing-guide.md:
  - Co-locate test files with source files
  - Use proper naming conventions (*.unit.test.ts, *.component.test.tsx)
  - Use describe/it blocks with lowercase descriptions
  - Use conservative nesting with describe/it blocks
  - Keep tests short with single expect statements when possible
  - Test behavior, not implementation
  - For Next.js specific testing patterns, reference the Next.js testing documentation
- Update the GitHub Actions workflow (.github/workflows/personal-webapp.yml) to:
  - Add a test step that runs `npm run test:coverage`
  - Ensure tests run before the build step
- Verify all tests pass locally and in CI
```

## Additional Context

### Notes & Retrospective

[to be added once this task-work is completed]
