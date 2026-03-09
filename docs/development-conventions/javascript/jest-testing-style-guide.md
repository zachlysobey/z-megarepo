# Jest testing style guide

A style guide for the Jest JavaScript software testing framework.

See also:

- [Node.js Conventions](./nodejs-conventions.md)
- [Testing Guide](./testing-guide.md)

## Standards

### Use `describe` and `it`, with conservative nesting

For consistency, use `it` and `describe` and avoid `test`.

### The `describe` should be the exported name of the unit under test

### Use all lowercase in `it`

### Avoid the word `should`

Describe what the expected behavior is, not that it should be that way.

❌ avoid:

```ts
it('should do something', () => {
  expect(something).toBe('expected');
});
```

✅ prefer:

```ts
it('does something', () => {
  expect(something).toBe('expected');
});
```

### Avoid blank lines in `it` blocks

There are different schools of thought on this.

Two I like:

- Split tests logically into given/when/then or arrange/act/assert,
  separating those parts with blank lines
- Don't use blank lines at all. The rationale is two-fold: 1) an ideal
  test is very short. If you need blank lines to make it readable, it's
  too long. 2) It's a simple rule to follow and enforce.

Ultimately, this guide chooses the second option, mostly for simplicity.

### Strive for short tests with a single `expect`

### Separate *pure* unit tests from DOM-dependent (jsx/tsx) tests

### Configuration file style guide

#### Write configuration in TypeScript

#### Use multi-project config

[Jest Configuration: Projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)

#### Package.json run-script conventions

See [NPM run-script naming conventions](./npm-run-script-naming-conventions.md).

##### By run-script

- `npm test` - Should run all *fast* tests. This is the most useful
  command for local development so should be optimized as a command
  that can and will be run frequently.
- `npm run test:all`
- `npm run test:unit`
- `npm run test:component`
- `npm run test:coverage`

### Naming conventions

#### Differentiate between test types by file extension

- `[something].unit.test.tsx`
- `[something].component.test.tsx`
- `[something].api.test.tsx`
- `[something].e2e.test.tsx`

#### One unit/component test per module, same (base) name as module

##### Examples

- `someModule.unit.test.ts`
- `SomeComponent.component.test.tsx`

### Prefer co-locating test files over separate `tests/` directories

For lower level (unit/component) tests.

### Use `using` for auto-cleanup of `spy`s

```js
test('logs a warning', () => {
  using spy = jest.spyOn(console, 'warn');
  doSomeThingWarnWorthy();
  expect(spy).toHaveBeenCalled();
});
```

## Open questions

### How should I handle location of x-module tests (integration / e2e / etc.)?

It probably makes sense to keep things at the top level (either right
under `src/` or as a sibling to it).

This became available in
[Jest v30](https://jestjs.io/blog/2025/06/04/jest-30#spies-and-the-using-keyword).
`using` is part of the
[Explicit Resource Management TC-39 proposal](https://github.com/tc39/proposal-explicit-resource-management).
It hit
[TypeScript in 5.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html).
