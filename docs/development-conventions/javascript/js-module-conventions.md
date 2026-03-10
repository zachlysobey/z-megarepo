# JavaScript module conventions

## Avoid `default` exports

Prefer named exports for better tree-shaking and explicit imports.

Avoid:

```js
export default function myFunction() { }
```

Prefer:

```js
export function myFunction() { }
```

## One named export per file

Keep files focused on a single export to maintain clear module
boundaries and improve maintainability.

Avoid:

```js
export function helperA() { }
export function helperB() { }
```

Prefer:

```js
// helperA.js
export function helperA() { }

// helperB.js
export function helperB() { }
```

## File name matches export name

File names must exactly match their export name, using whatever casing
convention the export uses. Kebab-case is reserved for non-JS/TS files
or JS/TS files with no exports.

Avoid:

```js
// utils.js
export function myHelper() { }
```

```js
// my-helper.js
export function myHelper() { }
```

Prefer:

```js
// myHelper.js
export function myHelper() { }
```

```js
// SomeClass.js
export class SomeClass { }
```

## Always prepend `node:` to Node.js core library imports

The `node:` prefix explicitly identifies Node.js built-in modules and
prevents potential naming conflicts with npm packages of the same name.

Avoid:

```js
import fs from 'fs'
```

Prefer:

```js
import fs from 'node:fs'
```
