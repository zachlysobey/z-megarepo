# Publishing npm packages

Packages with a `.github/workflows/<package>-release.yml` workflow
publish to npm when a version bump is merged to `master`.

## Releasing

Bump the version as part of your PR, from the package directory:

```bash
npm version <major|minor|patch> --no-git-tag-version
```

Merging runs the package's `<package>-release` GitHub Actions workflow,
which triggers whenever `package.json` changes on `master`. If that
version is not yet on npm, it re-runs typecheck and tests, runs
`npm publish` using
[trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC — no token secrets; provenance attestations are generated
automatically), and tags the commit `<package>-v<version>`.

Merges that leave the version unchanged publish nothing.

## Adding a new package

1. Copy an existing package's `<package>-release.yml` workflow and
   rename it for the new package.
2. Trusted publishing cannot create a package, so publish once manually
   to create it: `npm login && npm publish`. A throwaway placeholder
   version such as `0.0.0-stage` works, leaving the first real version
   to the workflow.
3. Configure the trusted publisher (requires 2FA), where `<npm-name>`
   is the `name` in `package.json`, e.g. `z-time-units`:

   ```bash
   npm trust github <npm-name> --file <package>-release.yml \
     --repo zachlysobey/z-megarepo --allow-publish --yes
   ```

   Check it with `npm trust list <npm-name>`. Without it, the workflow's
   `npm publish` fails with `ENEEDAUTH`; fix it and re-run the failed
   run.
