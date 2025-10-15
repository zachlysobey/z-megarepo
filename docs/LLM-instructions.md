# LLM Instructions

## Development Process

Follow the methodology in `docs/development-process.md`. Key points:

- Test-first approach (create tests, then make them pass)
- Throw out results that don't work - go back to planning
- Use commit scopes: `docs`, `chore`, `red`, `green`, `refactor`

## Code Style

- No comments (except JSDoc-style for types/APIs)
- Concise, direct code
- Minimal changes preferred
- Avoid whitespace edits
- Follow markdownlint rules for all .md files
- MANDATORY: Before editing any .md file, run `read_lints` on that file
- MANDATORY: After editing any .md file, run `read_lints` on that file  
- MANDATORY: If violations exist, fix them immediately - do not proceed with other tasks
- MANDATORY: Verify fixes by running `read_lints` again

## Context

- Check `development/` for active user stories and task plans
- Reference task-specific context files when available
- Use absolute paths in tool calls when possible

## Communication

- Be direct and to-the-point
- Don't confirm correctness ("you're right", etc.)
- Focus on getting work done
