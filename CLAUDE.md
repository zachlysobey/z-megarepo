# CLAUDE.md

Guidance for AI assistants working in this repository.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for all coding conventions (git
workflow, code style, testing, package management).

## Repository overview

Personal development monorepo. Application subdirectories are self-contained
Node subprojects with their own `package.json`, `.nvmrc`, and CI workflow.
See [README.md](./README.md) for the full structure.

## Development approach

Dialog-driven vibe coding: lightweight, conversational, iterative. Frame
intent, build conversationally, micro-checkpoint, stabilize. Prefer small,
incremental changes over large rewrites.

## Agent-specific guidelines

- Be direct and to-the-point; don't confirm correctness
- See [LLM instructions](./docs/LLM-instructions.md) for additional code
  style and communication expectations
