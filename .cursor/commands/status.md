# /status - Human-Readable Project Status

Provide a clear, scannable status report. Balance readability with conciseness — include helpful context but omit empty sections and unnecessary boilerplate.

## 1. Git Context

```bash
git branch --show-current
git rev-list --left-right --count HEAD...origin/master
git log origin/master..HEAD --format="%h %s (%ar)"
```

- Current branch and relationship to `origin/master`
- `git rev-list --left-right --count HEAD...origin/master` outputs two numbers: commits ahead, then commits behind
- List commits ahead of origin/master with relative timestamps
- For vague commit messages ("wip", "progress"), add a brief description of what the commit does

## 2. Uncommitted Changes

This is the most important section.

```bash
git status --short
git diff --stat
git diff --cached --stat
```

Show:
- **Staged/Modified/Untracked/Deleted** files with `+/-` line counts
- For small changes (< 20 lines), show the actual diff content
- For larger changes, summarize what's being changed in each file
- Only show categories that have files

## 3. Analysis

Provide meaningful context about the changes:
- **Intent**: What's the apparent goal of these changes?
- **Status**: Does this look complete or in progress? Why?
- **Next steps**: What likely needs to happen next? (if not obvious, skip)

Be informative but not verbose — a short paragraph, not a checklist.

## 4. Timeline

- Last commit time (human-readable)
- Note if the repo has been inactive for a while

## 5. Tasks & Health (Conditional)

**Only include if there's something to report:**
- TODO/FIXME comments in changed files
- Lint errors, test failures, or build issues

Skip entirely if nothing relevant.

---

## Output Format

Example with feature branch and changes:

```
## Git: feature/auth
↳ 3 commits ahead of origin/master, 0 behind

• abc1234 - Add auth endpoint (2 hours ago)
• def5678 - "wip" → Added JWT token validation logic (5 hours ago)
• ghi9012 - "progress" → Started rate limiting middleware (1 day ago)

## Uncommitted Changes

Staged (2 files):
  + src/auth/middleware.ts  (+45, -12)
  + src/config/auth.ts      (+8)

Modified (1 file):
  ~ src/routes/api.ts       (+23, -5)

Untracked:
  ? src/auth/README.md

### Diff: src/routes/api.ts
```diff
+import { authMiddleware } from '../auth/middleware';
+
 app.get('/api/users', authMiddleware, (req, res) => {
```

## Analysis
Adding JWT-based authentication middleware to the API. The auth endpoint and token validation are done, but rate limiting is partially implemented — there's a TODO in middleware.ts for the rate limit config. Tests not yet added.

## Timeline
Last commit: 2 hours ago

## Tasks
⚠ TODO in middleware.ts:14 — "implement rate limit config"
```

Example for clean master branch:

```
## Git: master = origin/master

## Uncommitted Changes
None

## Timeline
Last commit: 3 days ago
```
