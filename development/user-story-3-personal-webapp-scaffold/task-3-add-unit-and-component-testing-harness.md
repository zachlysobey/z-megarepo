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

**Completed**: 2025-11-29

Successfully implemented a comprehensive unit and component testing harness for the Next.js personal-webapp project.

#### Key Implementation Details

**Jest Multi-Project Configuration**:
- Configured Jest with separate projects for unit tests (node environment) and component tests (jsdom environment)
- Used babel-jest with next/babel preset instead of next/jest's createJestConfig helper because the latter doesn't properly support multi-project configurations
- Unit tests run in node environment (faster, no DOM overhead)
- Component tests run in jsdom environment with React Testing Library support

**Test Scripts**:
- `npm test` - Runs all tests (unit + component)
- `npm run test:all` - Runs all tests (follows project conventions)
- `npm run test:unit` - Runs only unit tests using `--selectProjects unit`
- `npm run test:component` - Runs only component tests using `--selectProjects component`
- `npm run test:coverage` - Runs all tests with unified coverage report

**Example Tests Created**:
- `lib/example.ts` with `lib/example.unit.test.ts` - Demonstrates unit testing
- `components/Example.tsx` with `components/Example.component.test.tsx` - Demonstrates component testing
- Both tests follow the Jest testing style guide conventions (describe/it blocks, lowercase descriptions, co-located with source)

**Configuration Updates**:
- Updated eslint.config.mjs to ignore coverage directory
- Converted jest.setup.mjs to jest.setup.js (CommonJS) for compatibility with babel-jest
- Updated .nvmrc from "lts/krypton" to "24.11.1" to match package.json requirements
- CI workflow already configured correctly to run tests before build

#### Challenges & Solutions

**Challenge**: Next.js's `next/jest` helper doesn't work with Jest's multi-project configuration. When using `projects` array, the transform configuration wasn't being applied to individual projects.

**Solution**: Used babel-jest directly with `next/babel` preset. This provides the same functionality but works correctly with multi-project setup.

**Challenge**: jest.setup.mjs using ES modules caused issues with babel-jest.

**Solution**: Converted to CommonJS (jest.setup.js) using `require()` instead of `import`. Added eslint-disable comment to suppress the no-require-imports warning.

#### Verification

All test commands verified working:
- ✅ `npm run lint` - Passes
- ✅ `npm test` - All tests pass (2/2)
- ✅ `npm run test:unit` - Unit test passes (1/1)  
- ✅ `npm run test:component` - Component test passes (1/1)
- ✅ `npm run test:all` - All tests pass (2/2)
- ✅ `npm run test:coverage` - Shows 100% coverage
- ✅ CodeQL security scan - No vulnerabilities found

