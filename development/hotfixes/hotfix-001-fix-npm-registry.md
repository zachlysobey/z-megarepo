# Hotfix 001: Fix Registry

## Technical Approach

I accidentally generated a `package-lock.json` from a private npm registry (from my employer) since I have it set in `~/.npmrc`. This hotfix is to update that, and ensure the mistake does not happen again. I'll do that by updating both the node template's and the architecture-test package's `.npmrc`. And then regenerate the package lock.

## LLM Prompts Needed

### Prompt 1: Update `.npmrc`s

```text
- update two `.npmrc`s:
    1. /architecture-tests/.npmrc
    2. /project-templates/node-app-template/skeleton/.npmrc
- they should now have `registry=https://registry.npmjs.org/` at the top
- also add to the doc and example in /docs/development-conventions/javascript/npmrc-guidance.md
```

### Prompt 2: Regenerate `architecture-tests` package-lock

```text
Regenerate the architecture-tests project's package-lock.json now that the proper registry is set.
```

## Context References

- [Node version management](/docs/development-conventions/javascript/node-version-management-guide.md)
- [Package.json guide](/docs/development-conventions/javascript/package-json-guide.md)

### Notes & Retrospective

[to be added once this task-work is completed]
