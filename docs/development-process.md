# `z-megarepo` development process

## Overview

A development methodology where humans just write documentation and instructions, and let LLMs write all test & production code, in a test-first approach.

> **aside**: possible name? AI-assisted test commit revert (AITCR)

## related

- test && commit || revert (TCR)
- Test-driven Development (TDD)

## start with a goal in mind (i.e. "user story")

## create a high-level plan outline loosely outlining proposed PRs

**Directory structure**:

```text
development/
├── user-story-1-feature-a/
|   ├── overview.md
│   ├── task-1-setup.md
│   ├── task-2-configuration.md
│   └── task-3-integration.md
└── user-story-2-feature-b/
    └── task-1-implementation.md
```

> Note: `__drafts__/` can be used anywhere and will be gitignored.

Templates are provided in `development/__templates__`

## work on a single PR (branch) at a time

### step 1: **plan/document** – write a document with a highly-detailed plan for the code change

**Includes**:

- references to needed context
- prompts provided to LLM to create the code change
- new context via documentation and/or rules to provide LLM with what it needs to succeed

#### For "features" (changes that will update production code to change functionality)

These changes should include exactly two prompts

1) to create automated tests (tests only - no production code)
2) to make those tests pass (implementation only - no test changes)

#### For "chores" or "refactor" changes which do not change product functionality

Some changes will not follow the red/green (test/implement) pattern.
Those might include stuff like updates to a CI/CD harness, linting/testing configuration, etc...
For such tasks, a single "implement" prompt without testing is OK.

#### Possible additional step of actually describing the change as code, such that it can be replayed (codemod-style, etc.)

**pros**: *better* than vibe-code in that we have more control, and it can be better played back. LLM can help create the code mod, but this is a repeatable documented change.

**cons**: it takes more effort, and requires sorta breaking the intended paradigm (if at a lower-level of granularity) by the humans being more directly involved in actual coding.

### step 2: execute the LLM prompts

if any planned prompt does not create the desired result, *throw that result out!* and go back to step 1.

### step 3: review and retro the changes

### step 4: open the PR

## **notes**

### commit scopes

- `docs`
- `chore`
- `red`
- `green`
- `refactor`

### changelog generation

if the *docs* & *commits* are structured enough, we should be able to generate pretty amazing change documentation, potentially at different levels of granularity

### branch workflow

This is intended to closely mirror trunk-based development
I think it'll work best if all changes are 'up-to-date' with `master`
BUT... I think longer-term planning (beyond the current PR branch) might justify other long-lived branch(s) *just* for planning.

**Note**: The primary branch is `master` (not `main`). See [Git Conventions](../development-conventions/git/README.md) for full branch naming standards.

#### One *planning* branch* per user-story

This idea is kinda compelling in cases where we break a user story into a bunch of different PRs, but we might want to flesh out our ideas for those PRs
