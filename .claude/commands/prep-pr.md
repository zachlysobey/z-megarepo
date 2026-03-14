Prepare PR #$ARGUMENTS for merge by rebasing, reviewing comments, and
validating the title/description.

## Steps

### 1. Look up the PR

Fetch PR metadata and comments:

```
gh pr view $ARGUMENTS --json number,title,body,url,headRefName,comments,reviews
```

Also fetch inline review comments:

```
gh api repos/{owner}/{repo}/pulls/$ARGUMENTS/comments
```

If the PR doesn't exist, report the error and stop.

### 2. Review PR comments

Using the data from step 1:

- Summarize what's been said in PR comments and reviews
- Flag anything that looks unaddressed or unresolved

### 3. Check out and rebase

```
git fetch origin
git checkout <headRefName from step 1>
git rebase origin/master
```

- **Verify** the rebase is complete:

  ```
  git fetch origin master
  git log --oneline HEAD..FETCH_HEAD
  ```

  This must show no commits. If it does, fetch and rebase again.

- If conflicts arise, resolve them (ask for clarification if unclear)
- Push the rebased branch:

```
git push --force-with-lease
```

### 4. Evaluate title and description

Compare the PR title and body against the actual diff:

```
git diff origin/master...HEAD
```

- Flag if the title or description seem stale or inaccurate relative to the
  current changes
- Suggest updated title and body if needed

### 5. Report

Present a summary covering:

- **Comment review**: what was said, anything unaddressed
- **Rebase status**: clean rebase or conflicts resolved
- **Title/description assessment**: still accurate or needs updating
- **Suggested actions**: anything remaining before merge
