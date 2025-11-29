# NPM Run-Script Naming Conventions

See also:

- [NPM run-script conventions](./npm-run-script-conventions.md)
- [NPM run-script docs](https://docs.npmjs.com/cli/v9/commands/npm-run-script)
- [Testing guide](./testing-guide.md)

## Optimize Run-Scripts for Local Development

It's easy to collect A LOT of run-scripts, especially if you are making special flavors for each variation of a command you find. There will often be slight variations for commands as they run in CI pipelines, or in Dockerfiles, etc... In short, if it's not a command humans will be running on their own machines, it should not be a run-script.

## Leverage the *Special* Run-Scripts

There are several `npm` commands that will execute commands listed in `scripts` if they exist: `npm start`, `npm stop`, `npm restart`, `npm test`. Some of these have special behavior if no such script is defined in `scripts`. See [NPM run-script docs](https://docs.npmjs.com/cli/v9/commands/npm-run-script) for details about this.

These scripts can be very handy to specify because:

- They are really fast to type (`npm test` vs `npm run <some-test-command>`)
- They're a de-facto standard, and are often assumed present in projects.

Here, we suggest optimizing these scripts for local development workflows. What is the flavor of `npm start` or `npm test` that will most benefit from being fast to type and easy to remember? Also, it should probably not be *surprising* what the script does. If `npm test` *just* runs a single type of integration test, that might be *weird*, no matter how convenient it is to run those tests with just a few keystrokes.

Here we'll focus on the two most useful of these scripts, but consider using `npm stop` and/or `npm restart` if they seem relevant to your project.

### `npm start`

Optimize usage of `npm start` for local development workflows.
If you are building a web application, this should run the development server.


### `npm test`

We suggest using `npm test` to run an exhaustive (within reason) set of tests on the developer's machine.

Something like the following seems reasonable:

```json
{
  "scripts": {
    "test": "npm run test:unit:coverage && npm run lint && npm run test:integration"
  }
}
```

## Use Colons `:` to Create Run-Script Hierarchies

The best example of this might be for tests, which there are often several flavors of:

- `npm run test` (or `npm test`) – Run a convenient set of tests for local dev
- `npm run test:unit` – Run the unit tests
- `npm run test:unit:watch` – Run the unit tests in watch mode
- `npm run test:unit:coverage` – Run the unit tests while collecting coverage
- `npm run test:integration` – Run integration tests
- `npm run test:e2e` – Run end-to-end (e2e) tests
- `npm run test:all` – Run ALL the tests

## Consider `pre` and `post` Scripts

…

## Create Useful Aliases (*Within Reason*)

### ⚠️ Warning: Consider Inefficiencies for `run-scripts` that Reference Other Run-Scripts

As engineers, we tend to be trained to keep things DRY, and there's a real beauty in having scripts reference each other.

Example:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "npm test",
    "test:unit:coverage": "npm run test:unit -- --coverage",
    "test:unit:watch": "npm run test:unit -- --watch"
  }
}
```

At first glance, this looks OK, **but**, every time a `npm run-script` calls another run-script it adds a not insignificant amount of time (maybe 500ms?). In the above example, `npm run test:unit:watch` calls `test:unit` which then calls `jest`. It'd have saved some time to skip the middleman and just have `test:unit:watch` set to `jest --watch`. In practice, *one* middleman isn't usually that bad, but once two or three sneak their way in, you really start to feel it!

This is even more motivation to keep the list of scripts relatively small.

## Consider Moving Complexity to Shell Scripts and/or CLIs

…
