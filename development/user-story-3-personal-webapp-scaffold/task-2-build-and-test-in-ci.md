# Task 2: Build & Test Project in CI

## Technical Approach

- Set up GitHub Actions workflow for continuous integration
- Configure build and test steps for the Next.js application
- Ensure TypeScript type checking passes
- Run ESLint for code quality checks
- Verify the build completes successfully
- Set up caching for faster CI runs (node_modules, Next.js build cache)

## LLM Prompts Needed

### Prompt 1: Create GitHub Actions Workflow

```text
Create a GitHub Actions CI workflow for the Next.js project for personal-webapp with the following requirements:
- Create the workflow file at `.github/workflows/personal-webapp.yml` in the project root
- Trigger on push to any branch or any pull request to master
- Use Node.js LTS version (reference this project's .nvmrc)
- Install dependencies with npm ci
- Run npm scripts `build`, and `lint`
- Cache node_modules and .next build cache
After setting up the CI workflow:
- Verify the workflow file syntax is correct
- Check that all referenced scripts exist in package.json
- Ensure the workflow will run on the expected triggers
- Add a README section or comment explaining the CI setup
```

## Additional Context

- Follow GitHub Actions best practices for Node.js projects
- Use official actions where possible (actions/checkout, actions/setup-node, actions/cache)
- Reference the project's development conventions for any specific CI requirements

### Notes & Retrospective

**Completed**: 2025-11-28

Successfully created GitHub Actions workflow at `.github/workflows/personal-webapp.yml` with:
- Triggers on push to any branch and PRs to master
- Node.js version from `.nvmrc` (lts/jod)
- npm dependency caching for faster CI runs
- ESLint and Next.js build verification
- Working directory set to `personal-webapp/`

The workflow follows the same pattern as the existing `architectural-fitness-tests.yml` workflow in the repository. All required npm scripts (`build` and `lint`) are present in package.json.
