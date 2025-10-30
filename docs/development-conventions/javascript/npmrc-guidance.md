# Guidance for the `.npmrc` File

## `engine-strict` and `package.json`'s `engines` field

If we put `engine-strict=true` in `.npmrc`, `npm` will fail any `install` commands if the current `npm` or `node` versions do not satisfy the version ranges specified in the `engines` field of the project's `package.json` file.

## Example `.npmrc` file

```txt
# Makes it so that failing to adhere to the npm and node versions set in the
# package.json file fails the build.
engine-strict=true

# Dependencies saved to package.json will be configured with
# an exact version rather than using npm's default semver range operator.
# More info:
# - https://docs.npmjs.com/cli/v10/using-npm/config#save-exact
# - https://docs.renovatebot.com/dependency-pinning/
save-exact=true
```
