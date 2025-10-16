# Markdown Linting Guide

This project uses `markdownlint` to enforce Markdown code style.

## Validation

Run linting locally:

```bash
# Check all markdown files
npx markdownlint "**/*.md"

# Fix auto-fixable issues
npx markdownlint "**/*.md" --fix
```
