# Task 1: Initialize Next.js Project

## Technical Approach

- Set up in a dedicated directory within the project structure
- Use `create-next-app` to scaffold a new Next.js project with App Router
- Configure basic project structure (app, components, lib directories)
- Set up `.env.local` for environment variables
- Ensure `.gitignore` excludes sensitive files and build artifacts

## LLM Prompts Needed

### Prompt 1: Create Next.js Project

```text
Initialize a new Next.js project using create-next-app with the following requirements:
- Use the App Router (not Pages Router)
- Use TypeScript
- Use ESLint
- Do NOT use Tailwind CSS (we'll use vanilla CSS)
- Do NOT use the src/ directory
- Create the project in a new directory called `personal-webapp/` within the current workspace
- After creation, verify the basic project structure is set up correctly
```

### Prompt 2: Configure Environment and Git

```text
Set up the environment configuration for the Next.js project:
- Create a `.env.local` file with placeholder comments for the environment variables we'll need (Google OAuth Client ID, Client Secret, NextAuth Secret, Authorized Email)
- Verify `.gitignore` includes `.env.local`, `.env*.local`, and standard Next.js build artifacts
- Add a brief README.md in the project root explaining this is a personal webapp with Google OAuth
```

## Additional Context

- reference docs/deveopment-conventions/* and docs/project-templates/node-app-template/ for my application building preferences.

### Notes & Retrospective

[to be added once this task-work is completed]
