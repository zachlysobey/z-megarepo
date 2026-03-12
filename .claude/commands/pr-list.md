List open PRs for this repository with status and check information.

## Steps

### 1. Fetch open PRs

```
gh pr list --json number,title,headRefName,url,createdAt,updatedAt,isDraft,statusCheckRollup,commits,comments,additions,deletions,changedFiles,mergeStateStatus
```

If there are no open PRs, report that and stop.

### 2. Display grouped by status

Split PRs into three groups with headers. Only show groups that have PRs:

```
## 🟢 Active PRs (N)
## 📝 Drafts (N)
## 🕸️ Stale (N)
```

A PR is "stale" if it hasn't been updated in 14+ days (and is not a draft).
Draft PRs go in Drafts regardless of age. Everything else is Active.

### 3. Format each PR

Do NOT use markdown bullet lists — they don't render well in the terminal.
Instead, use bold text and plain lines separated by blank lines.

Each PR is exactly 2 lines with a blank line between PRs:

```
[**#42 Title of PR**](url) — effort: 🟡 small · ⚠️ conflicts · 🔄 behind · 🔴 CI failing
+100 -20 · 3 files · 2 commits · opened 2d ago · updated 4h ago · 💬 3 comments
```

The first line is the linked title, effort estimate, and any status flags.
The second line is stats, using middle dots (·) as separators.

Only include flags that apply — omit them entirely if everything is clean.
Only show comment count if > 0.

Emoji legend for effort:
- 🟢 trivial — under 50 lines, 1-2 files
- 🟡 small — under 200 lines or 1-5 files
- 🟠 medium — under 500 lines or 5-15 files
- 🔴 large — 500+ lines or 15+ files

Emoji for flags (only show when applicable):
- 🔴 CI failing
- ⚠️ conflicts
- 🔄 behind (needs rebase)
- 💬 N comments

Estimate effort based on lines changed, files changed, commit count,
and blockers (failing CI, conflicts, draft status).
