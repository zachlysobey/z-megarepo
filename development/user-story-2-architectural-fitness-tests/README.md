# User Story 2: Architectural Fitness Tests

## User Story

As a software architect, I want to implement fitness tests for evolutionary architecture so that I can continuously validate architectural constraints and prevent architectural drift.

## Goal

Establish a framework for architectural fitness tests that can detect violations of architectural principles, dependencies, and constraints as the codebase evolves.

## Success Criteria

- [ ] automated tests for structure of the `development/` directory.
- [ ] automated tests for markdownlint
- [ ] tests running in CI and gating PRs

## Context References

- [Evolutionary Architecture by Neal Ford](https://www.thoughtworks.com/radar/techniques/evolutionary-architecture)

## Tasks

1) Set up architectural-tests-directory
1) Set up basic fitness test framework and tooling
1) Integrate fitness tests into CI pipeline
1) Create tests for `development/` directory structure constraints
1) Integrate markdownlint tests into fitness test suite

## Future Iterations

There are numerous architecture/fitness tests we can add in the future.

Some possible examples:

- enforce file naming conventions
- check links in documentation
- avoid empty files
- ensure some common structure across `project-templates/`

Actual checks on production code will likely be done within the sub-projects holding that code, where these tests will be higher level.
