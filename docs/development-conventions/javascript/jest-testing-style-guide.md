# Jest Testing Style Guide

A style guide for the Jest JavaScript software testing framework.

See also:

- [nodejs conventions](./nodejs-conventions.md)
- [testing guide](./testing-guide.md)

## Standards

### Use `describe` and `it`, with Conservative Nesting

For consistency, use `it` and `describe` and avoid `test`.

### The `describe` Should Be the Exported Name of the Unit Under Test

### Use All Lowercase in `it`

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

### Avoid Blank Lines in `it` Blocks

There are different schools of thought on this.

Two I like:
- Split tests logically into given/when/then or arrange/act/assert, separating those parts with blank lines
- Don't use blank lines at all. The rationale is two-fold: 1) an ideal test is very short. If you need blank lines to make it readable, it's too long. 2) It's a simple rule to follow and enforce.

Ultimately, this guide chooses the second option, mostly for simplicity.

### Strive for Short Tests with a Single `expect`

### Separate *Pure* Unit Tests from DOM-Dependent (jsx/tsx) Tests

### Configuration File Style Guide

#### Write Configuration in TypeScript

#### Use Multi-Project Config

[Jest Configuration: Projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)

#### Package.json Run-Script Conventions

See [NPM run-script naming conventions](./npm-run-script-naming-conventions.md).

##### By Run-Script

- `npm test` - Should run all *fast* tests. This is the most useful command for local development so should be optimized as a command that can and will be run frequently.
- `npm run test:all`
- `npm run test:unit`
- `npm run test:component`
- `npm run test:coverage`

### Naming Conventions

#### Differentiate Between Test Types by File Extension

- `[something].unit.test.tsx`
- `[something].component.test.tsx`
- `[something].api.test.tsx`
- `[something].e2e.test.tsx`

#### One Unit/Component Test Per Module, Same (Base) Name as Module

##### Examples

- `someModule.unit.test.ts`
- `SomeComponent.component.test.tsx`

### Prefer Co-Locating Test Files Over Separate `tests/` Directories

For lower level (unit/component) tests.

### Use `using` for Auto-Cleanup of `spy`s

```js
test('logs a warning', () => {
  using spy = jest.spyOn(console, 'warn');
  doSomeThingWarnWorthy();
  expect(spy).toHaveBeenCalled();
});
```

## Open Questions

### How Should I Handle Location of X-Module Tests (Integration / E2E / etc..)?

It probably makes sense to keep things at the top level (either right under `src/` or as a sibling to it).



This became available in [Jest v30](https://jestjs.io/blog/2025/06/04/jest-30#spies-and-the-using-keyword).
`using` is part of the [Explicit Resource Management TC-39 proposal](https://github.com/tc39/proposal-explicit-resource-management).
It hit [TypeScript in 5.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html).