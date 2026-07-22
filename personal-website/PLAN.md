# Migration plan: personal-site into z-megarepo

## Overview

Migrate <https://github.com/zachlysobey/personal-site> into z-megarepo as a
new top-level subproject (`personal-website/`), preserving full git history
and conforming to existing monorepo conventions.

The personal-site is a Gatsby 2 static blog (React 16, Markdown content,
~119 commits, active 2018-2021). It is currently deployed to GitHub Pages at
`zach.lysobey.com` via Travis CI.

## Goals

- Preserve the full git history of personal-site
- Fit into z-megarepo project structure and conventions
- Incremental, reviewable steps (one PR per phase where practical)
- Minimize disruption to the existing monorepo

## Non-goals (for initial migration)

- Upgrading Gatsby, React, or Node versions (separate follow-up work)
- Redesigning the site
- Changing the hosting/deployment target

---

## Phase 1: Import repository with history

**PR 1 — Import personal-site subtree**

Use `git subtree` (or `git merge --allow-unrelated-histories` with a
subdirectory filter) to bring the full history of `personal-site` into
z-megarepo under `personal-website/`.

### Steps

1. Add the personal-site repo as a remote:

   ```bash
   git remote add personal-site-origin \
     https://github.com/zachlysobey/personal-site.git
   git fetch personal-site-origin
   ```

2. Import using `git subtree add`:

   ```bash
   git subtree add --prefix=personal-website \
     personal-site-origin master --squash=false
   ```

   This places all files under `personal-website/` and preserves the full
   commit history (119 commits) as part of the monorepo's history.

3. Remove the temporary remote:

   ```bash
   git remote remove personal-site-origin
   ```

4. Verify the history is intact:

   ```bash
   git log --oneline -- personal-website/ | wc -l   # expect ~119
   git log --oneline -- personal-website/ | tail -5  # earliest commits visible
   ```

### Outcome

All personal-site files live under `personal-website/` with full git
history accessible via `git log -- personal-website/`.

---

## Phase 2: Align with monorepo conventions

**PR 2 — Conform to z-megarepo subproject structure**

Update configuration files to match existing subproject conventions
(modeled after `personal-webapp/` and `personal-mobile-app/`).

### Steps

1. **Update `.nvmrc`** — change from `lts/fermium` (Node 14) to
   `lts/krypton` (current monorepo standard), or keep the existing value
   temporarily if Gatsby 2 is incompatible with newer Node versions (see
   Phase 5 notes).

2. **Update `.npmrc`** — add `save-exact=true` and
   `registry=https://registry.npmjs.org/` to match monorepo convention:

   ```ini
   engine-strict=true
   save-exact=true
   registry=https://registry.npmjs.org/
   ```

3. **Update `package.json`**:
   - Ensure `"private": true`
   - Update `engines` to match `.nvmrc` choice
   - Update `name` to `personal-website`

4. **Remove Travis CI config** — delete `.travis.yml` (CI will move to
   GitHub Actions in the next phase).

5. **Remove Husky/lint-staged** — pre-commit hooks are a repo-level
   concern; remove `.husky/` directory and related `package.json` config
   (`prepare`, `precommit`, `lint-staged` fields). If the monorepo adopts
   hooks later, they'll be configured at the root.

6. **Run `npm install`** to regenerate `package-lock.json` under the
   updated configuration.

### Outcome

`personal-website/` follows the same structural conventions as other
subprojects in the monorepo.

---

## Phase 3: Add CI workflow

**PR 3 — Add GitHub Actions workflow for personal-site**

Create `.github/workflows/personal-website.yml` following the established
pattern.

### Template

```yaml
name: Personal Website CI

on:
  push:
    branches: ["*"]
  pull_request:
    branches: ["master"]

jobs:
  personal-website-ci:
    name: Personal Website CI
    runs-on: ubuntu-latest

    permissions:
      contents: read

    defaults:
      run:
        working-directory: personal-website

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: "personal-website/.nvmrc"
          cache: "npm"
          cache-dependency-path: "personal-website/package-lock.json"

      - name: Install dependencies
        run: npm ci

      - name: Build Gatsby site
        run: npm run build
```

### Notes

- No lint or test steps initially (the project has no tests and only
  Prettier for formatting).
- A Prettier check step (`npx prettier --check 'src/**/*.js'`) can be
  added once formatting is verified clean.
- Build verification is the primary gate.

### Outcome

Every push and PR runs CI for `personal-website/`, consistent with other
subprojects.

---

## Phase 4: Update monorepo documentation

**PR 4 — Add personal-website to repo docs**

### Steps

1. **Update `README.md`** — add `personal-website/` to the repository
   structure listing:

   ```text
   z-megarepo/
   ├── architecture-tests/     # Architectural fitness tests
   ├── book-reports/           # Marp markdown slideshows
   ├── docs/                   # Conventions and reference documentation
   ├── infra/                  # GCP infrastructure (Terraform)
   ├── personal-mobile-app/    # Expo/React Native mobile app
   ├── personal-webapp/        # Next.js + React 19 + TypeScript
   ├── personal-website/       # Gatsby blog (zach.lysobey.com)
   └── project-templates/      # Scaffolding templates
   ```

2. **Update `docs/vision.md`** — the "Blog platform" bullet already
   covers this conceptually; optionally add a note that personal-website
   now lives in the monorepo.

3. **Clean up this migration plan** — mark phases as completed, or move
   the document to an archive location.

### Outcome

New contributors and tooling can discover `personal-website/` from the
top-level documentation.

---

## Phase 5: Modernization (future work)

These are follow-up efforts after the migration is complete. Each should
be its own PR or series of PRs.

### 5a. Node version upgrade

Gatsby 2 requires Node 14 or lower. If the site stays on Gatsby 2, the
`.nvmrc` must remain at `lts/fermium`. Upgrading Node requires upgrading
Gatsby first.

### 5b. Gatsby upgrade (2 → 4 → 5)

- Gatsby 3 was a transitional release; upgrade path is typically 2 → 4 → 5.
- Key changes: React 18 support, new image plugin, ESM config files.
- Many Gatsby 2 plugins have breaking changes in later versions.
- Consider whether Gatsby is still the right choice, or whether migrating
  to Next.js (already used in `personal-webapp/`) or another framework
  would be more maintainable.

### 5c. Framework migration (Gatsby → Next.js)

- Consolidating on Next.js would reduce tooling diversity in the monorepo.
- Markdown content and frontmatter can be preserved with libraries like
  `next-mdx-remote` or `contentlayer`.
- The `personal-webapp/` project could potentially absorb the blog
  content, eliminating `personal-website/` as a separate subproject
  entirely.

### 5d. Deployment migration

- Move from GitHub Pages to the monorepo's GCP infrastructure, or to
  Vercel/Netlify.
- Update DNS for `zach.lysobey.com` accordingly.
- Remove the `static/CNAME` file once DNS is reconfigured.

### 5e. Testing and linting

- Add ESLint configuration aligned with monorepo conventions.
- Add basic tests (at minimum, a build smoke test).
- Convert JavaScript to TypeScript incrementally.

### 5f. Content refresh

- The most recent post is from 2020; review and update content.
- Clean up draft posts.
- Migrate Google Analytics from UA to GA4 (or remove).

---

## Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Gatsby 2 incompatible with monorepo Node version | High | Medium | Keep separate `.nvmrc` at `lts/fermium` until upgraded |
| `npm ci` fails due to stale lockfile | Medium | Low | Regenerate `package-lock.json` during Phase 2 |
| History merge creates confusing git log | Low | Low | Use `git subtree add` which cleanly namespaces commits |
| CI build fails on older Gatsby | Medium | Medium | Pin Node version in workflow to match `.nvmrc` |
| GitHub Pages deployment breaks | Low | Low | Original repo remains intact as fallback |

---

## Sequencing summary

| Phase | PR | Description | Depends on |
|-------|----|-------------|------------|
| 1 | PR 1 | Import subtree with history | — |
| 2 | PR 2 | Align with monorepo conventions | Phase 1 |
| 3 | PR 3 | Add GitHub Actions CI | Phase 2 |
| 4 | PR 4 | Update monorepo docs | Phase 1 |
| 5a-f | Future PRs | Modernization work | Phase 2 |

Phases 3 and 4 can be combined into a single PR if preferred. Phases 1
and 2 could also be combined, but keeping them separate makes review
easier and isolates the history import from convention changes.
