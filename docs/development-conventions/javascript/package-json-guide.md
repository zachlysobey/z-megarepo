# `package.json` Guide

See also:

- [NPM Run-Script Conventions](./npm-run-script-conventions.md)
- [`.npmrc` guidance](./npmrc-guidance.md)

## Use Exact Versions

All dependencies must be installed with exact versions `--save-exact`.

This can and should be enforced via `.npmrc` configuration (see [Guidance for the `.npmrc` File](./npmrc-guidance.md))

## Avoid Directly Editing `package.json`

Node Package Manager (NPM) does some automatic formatting of the `package.json` at different times (like `npm install`) which, if you made direct changes, can cause some annoying churn (and noise in your git history).

Modern versions of `npm` allow for modifying `package.json` via the command line (via `npm pkg`) so there's really no reason to touch the file directly anymore.

Some examples:

```bash
# add a dependency
npm install some-dependency

# update package description
npm pkg set description='Awesome package'
```

Use `npm help pkg` to see even more usage examples.

If you do make direct changes to `package.json`, it's good practice to do `npm pkg fix` which will format the file.
