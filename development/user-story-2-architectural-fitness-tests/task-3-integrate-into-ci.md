# Task 3: Integrate into CI

## Technical Approach

- We currently have a single (failing) (jest) test executed via `npm test`.
- We'll want to add this as a new Github Action Workflow, so it runs in CI on branch builds and pull requests.
- We'll leave the test failing so we can see it fail in CI, but then make it pass to see CI pass.
- Finally, we'll remove the dummy CI step we have in place, to leave stuff nice and clean

## LLM Prompts Needed

### Prompt 1: Add CI Step to Execute Tests

```text
- Set up a new Github Actions Workflow named "Architectural Fitness Tests"
- It should run on pushes to any branch (`*`)
- It should also run on pull_requests to `master`
- It should pull down the repo code (`actions/checkout`)
- Using `actions/setup-node` with version `lts/jod` (this is actually correct, please believe me), it should:
    - cd into `architecture-tests/`
    - npm ci to install
    - run npm test
```

### Prompt 2: Make Failing Test Pass

```text
Update [the dummy test](../../architecture-tests/dummy.arch.test.ts) to pass
```

### Prompt 3: Remove Obsolete CI step

```text
Delete the ci-hello-world Github workflow
```

## Additional Context

- [LLM Instructions](../../docs/LLM-instructions.md)
- [Dev Process](../../docs/development-process.md)
- [Node version management](../../docs/development-conventions/javascript/node-version-management-guide.md)
- [JS Dev Conventions](../../docs/development-conventions/javascript/README.md)
- [Architecture Tests package](../../architecture-tests/package.json)
- [ci-hello-world GH workflow](../../.github/workflows/ci-hello-world.yml)

### Notes & Retrospective

[to be added once this task-work is completed]
