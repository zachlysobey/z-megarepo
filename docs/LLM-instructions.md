# LLM Instructions

## Development Process

Follow the methodology in `docs/development-process.md`. Key points:

### Planning Stage

When helping me scaffold out user-story & task documentation...

- Build in tiny incremental steps. NEVER go off and write hundreds (or even dozens of lines) of documentation.
- Use a conversational style to collaborate with me in generating documentation.

### Execution Stage

- Test-first approach (create tests, then make them pass)
- **CRITICAL**: Do not change *anything* but documentation unless its via a user-story/task prompt
- **CRITICAL**: Prompt 1 creates tests ONLY - no production code
- **CRITICAL**: Prompt 2 creates implementation ONLY - no touching tests
- Use commit scopes: `docs`, `chore`, `red`, `green`, `refactor`

## Code Style

- No comments (except JSDoc-style for types/APIs)
- Concise, direct code
- Minimal changes preferred
- Avoid whitespace edits
- Follow markdownlint rules for all .md files (per [our markdown linting guide](./development-conventions/markdown/linting-guide.md)))
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
