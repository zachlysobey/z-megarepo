# Publishing npm packages

Packages with a `.github/workflows/<package>-release.yml` workflow
publish to npm automatically when PRs that touch them are merged to
`master`.

## Releasing

The merged PR's title, a [Conventional Commit], picks the release:

| PR title      | Release |
| ------------- | ------- |
| `fix: …`      | patch   |
| `feat: …`     | minor   |
| `<type>!: …`  | major   |
| anything else | none    |

Don't bump versions by hand. On merge, the package's `<package>-release`
workflow re-runs typecheck and tests, bumps the version, adds a
`CHANGELOG.md` entry from the PR title, and runs `npm publish` using
[trusted publishing] (OIDC — no token secrets; provenance attestations
are generated automatically). It then pushes a
`chore(<package>): release v<version> [skip ci]` commit and a
`<package>-v<version>` tag to `master` with the `RELEASE_DEPLOY_KEY`
deploy key, which bypasses the `master` ruleset.

Re-running a failed release is safe; each PR is released at most once.

[Conventional Commit]: https://www.conventionalcommits.org/
[trusted publishing]: https://docs.npmjs.com/trusted-publishers

## Adding a new package

1. Copy an existing package's `<package>-release.yml` workflow and
   rename it for the new package.
2. Start the package at version `0.0.0` and list `CHANGELOG.md` in
   `files`; the release workflow creates the changelog. The `feat` PR
   that adds the package releases `0.1.0`.
3. Before merging, create the package on npm, which trusted publishing
   cannot do: publish a throwaway `0.0.0-stage` version by hand with
   `npm login && npm publish`.
4. Configure the trusted publisher (requires 2FA), where `<npm-name>`
   is the `name` in `package.json`, e.g. `z-time-units`:

   ```bash
   npm trust github <npm-name> --file <package>-release.yml \
     --repo zachlysobey/z-megarepo --allow-publish --yes
   ```

   Check it with `npm trust list <npm-name>`. Without it, the workflow's
   `npm publish` fails with `ENEEDAUTH`; fix it and re-run the failed
   run.
