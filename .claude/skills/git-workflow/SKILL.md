---
name: git-workflow
description: >
  Git workflow for branching, committing, pushing, and creating/updating PRs.
  Auto-triggers when making code changes that need committing or creating/updating PRs.
---

# Git workflow

Follow [CONTRIBUTING.md](../../../CONTRIBUTING.md) for commit format and branch
conventions. This skill covers the *mechanics* of executing the workflow.

## Branching

- Create feature branches from `master` (the primary branch, not `main`)
- Keep branches up-to-date with `master`
- Use descriptive branch names; there is no required convention, but patterns
  like `feat/add-auth`, `fix/login-redirect`, `docs/update-readme` work well

```bash
git checkout master && git pull && git checkout -b <branch-name>
```

## Committing

- Use [Conventional Commits](https://www.conventionalcommits.org/):
  `<type>[(<scope>)]: <description>`
- Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`
- Prefer staging specific files by name over `git add -A` or `git add .`
- Never commit unless the user explicitly asks
- Never amend commits unless the user explicitly asks

## Pushing

- First push: use `git push -u origin <branch-name>`
- Subsequent pushes: `git push`
- Confirm with the user before pushing

## Creating PRs

Use `gh pr create` with title and body:

```bash
# Title follows Conventional Commits (scope is optional):
TITLE="feat(auth): add login endpoint"
TITLE="docs: update README"

# Body uses the standard template:
BODY="$(cat <<'EOF'
## Summary

- <bullet describing change>
- <bullet describing change>

## Test plan

- [ ] <verification step>
- [ ] <verification step>
EOF
)"

gh pr create --title "$TITLE" --body "$BODY"
```

Guidelines:

- PR title follows Conventional Commits format, under 70 characters
- Summary section: concise bullets describing what changed and why
- Test plan: checklist of verification steps
- If the PR relates to an issue, mention it in the summary (e.g., "Closes #42")

## Updating branches with open PRs

When asked to make changes on a branch that has an open PR:

1. **Check the PR** with `gh pr view --json title,body,number`
2. **Compare intent**: do the new changes align with the PR's stated purpose?
3. **If aligned**: commit and push, then check if the PR title/description
   still accurately reflect the full set of changes. If stale, suggest
   updates via `gh pr edit <number> --title "..." --body "..."`
4. **If misaligned**: tell the user the new changes seem to serve a different
   purpose than the open PR, and suggest creating a new branch and PR instead

## Merging

- Use `merge` (not squash or rebase) when merging PRs
- This is a repo convention — see
  [git conventions](../../../docs/development-conventions/git/README.md)
