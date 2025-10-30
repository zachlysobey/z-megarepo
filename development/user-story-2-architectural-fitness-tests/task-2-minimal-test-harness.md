# Task 2: Set up basic fitness test framework and tooling

## Technical Approach

- Choose Jest as the testing framework (familiar, good for file system testing)
- Set up minimal test configuration following JavaScript conventions
- Create one simple test to verify framework works

## LLM Prompts Needed

### Prompt 1: Create Tests

```text
- Follow the project's JavaScript conventions (including JS testing conventions from /docs/development-conventions/javascript/testing-guide.md)
- execute `nvm use` to ensure use of the correct node/npm versions
- Create minimal jest testing setup, executed via package.json `test` run-script
- For now, we only need this single `npm test` script, as we only have a single type of test so far (architecture tests). Eventually we'll build out more complexity as described in the testing conventions.
- Add a single (failing) Jest test file named `dummy.arch.test.ts` with `it('fails', ...)` so we can see the tests execute.
- Since this package's main purpose is running tests, install jest, ts-jest, and typescript as regular dependencies. However, @types/jest should be installed as a devDependency since TypeScript types are only needed during development, not at runtime.
```

## Additional Context

- [JavaScript conventions](/docs/development-conventions/javascript/README.md)
- [Testing guide](/docs/development-conventions/javascript/testing-guide.md)
- [Node version management](/docs/development-conventions/javascript/node-version-management-guide.md)
- [Package.json guide](/docs/development-conventions/javascript/package-json-guide.md)

### Notes & Retrospective

[to be added once this task-work is completed]
