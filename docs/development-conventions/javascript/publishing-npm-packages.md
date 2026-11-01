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

   Check it with `npm trust list <npm-name>`. Leave out `--env`; the
   release workflows don't use a GitHub environment.

## Troubleshooting

If the workflow's `npm publish` step fails with `ENEEDAUTH`, the
trusted publisher is missing or doesn't match the workflow — npm
reports the rejected token exchange only at verbose log level. Run
`npm trust list <npm-name>`, fix the configuration, then re-run the
failed workflow run; it is safe to re-run, since it skips versions
already on npm.
