# Task 1: Backstage Proof of Concept

## Technical Approach

- Use Backstage's official create-app template
- Install in `backstage/` subdirectory (monorepo structure)
- Configure for local development
- Set up basic Docker containerization
- Document setup and run instructions

## LLM Prompts Needed

### Prompt 1: Create Tests

```text
Create comprehensive tests for a Backstage application setup that verify:
1. Application starts successfully
2. UI is accessible on expected port
3. Default catalog entries are loaded
4. Basic navigation components render
5. Build process completes without errors

Include both unit tests and integration tests where appropriate.
Follow the project's [JavaScript testing conventions](/docs/development-conventions/javascript/testing-guide.md)
```

### Prompt 2: Implement Setup

```text
Set up a new Backstage application using the official create-app template with the following requirements:
1. Use latest stable version
2. Install in `backstage/` subdirectory (this is a monorepo)
3. Configure for local development
4. Set up basic Docker containerization
5. Include basic documentation
6. Ensure all tests pass

Provide clear setup and run instructions.
```

## Important Context

- /docs/LLM-instructions.md
- /docs/development-conventions/javascript/testing-guide.md
- /docs/development-conventions/markdown/linting-guide.md
