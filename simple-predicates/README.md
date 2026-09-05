# simple-predicates

A tiny, dependency-free TypeScript library of type-narrowing predicates.
Everything it exports is a one-argument function that answers a yes/no
question about a single unknown value.

The entire implementation is a single TypeScript file:
[`index.ts`](https://github.com/zachlysobey/z-megarepo/blob/master/simple-predicates/index.ts).

Adapted from the predicates in
[`z-validate`](https://github.com/zachlysobey/z-validate/tree/master/src/predicates),
reduced to only the simplest cases.

## Usage

```ts
import { isNonEmptyString, isNumber } from "z-simple-predicates";

isNumber("1"); // false
isNumber(NaN); // false

const parsed: unknown = JSON.parse(input);
if (isNonEmptyString(parsed)) {
  parsed.toUpperCase(); // narrowed to string
}
```

## The predicate types

```ts
type SimplePredicate = (value: unknown) => boolean;
type NarrowingPredicate<T> = (value: unknown) => value is T;
```

`SimplePredicate` is the contract every export satisfies:

- **Unary** — exactly one argument, so predicates are directly usable as
  `Array.prototype.filter` and `.every` callbacks.
- **Total** — accepts any value and does not throw, so it is safe on
  untrusted input without a `try`/`catch`.
- **Pure** — no mutation, no I/O, no dependence on anything but the
  argument.

`NarrowingPredicate<T>` is a `SimplePredicate` that additionally reports
what a `true` result proves, and TypeScript treats it as a subtype: a
`NarrowingPredicate` is accepted anywhere a `SimplePredicate` is
expected, and `SimplePredicate[]` types a mixed collection of both.

Nearly every predicate here narrows. The base type exists for the ones
that answer a question about a *value* rather than its type — `isTruthy`
and `isFalsy` — where a type guard would be either unsound or vacuous.

Narrowing is lost through the base type, so annotate with
`NarrowingPredicate` wherever the call site should narrow:

```ts
const strings = mixed.filter(isString); // string[]

const asBase: SimplePredicate = isString;
const notStrings = mixed.filter(asBase); // unknown[]
```

## API

### Primitives

`isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol`, `isNull`,
`isUndefined`

### Nullishness

`isNil` (`null` or `undefined`), `isNotNil`

### Truthiness

`isTruthy`, `isFalsy` — the only two that do not narrow

### Objects and functions

`isObject`, `isPlainObject`, `isArray`, `isFunction`, `isDate`,
`isRegExp`, `isError`, `isPromise`, `isMap`, `isSet`

### Number refinements

`isFiniteNumber`, `isInteger`, `isSafeInteger`

### String refinements

`isEmptyString`, `isNonEmptyString`, `isBlankString`

### Array refinements

`isEmptyArray`, `isNonEmptyArray`

See [`index.ts`](./index.ts) for the exact type and semantics of each
predicate.

## Semantics

- **Broken values are rejected by their own type's predicate.**
  `isNumber(NaN)` is `false` and `isDate(new Date("nope"))` is `false`.
  A value that is unusable as a number or a date is not one. Use
  `Number.isNaN` directly when the question really is "is this `NaN`".
- **Built-ins are identified by brand, not by `instanceof`**, so values
  that cross a realm boundary (an iframe, a worker, `node:vm`) are
  recognized correctly. The trade-off is that a value can claim a brand
  it does not have via `Symbol.toStringTag`: these predicates describe
  shape, not provenance, and are not a security boundary.
- **Refinements narrow to the base type**, not to a synthetic one:
  `isNonEmptyArray` narrows to `readonly unknown[]`, not to a
  `[unknown, ...unknown[]]` tuple. Encoding "non-empty" in the type
  buys little and complicates every signature.

## Package boundaries

The whole package is unary predicates over one value. Deliberately absent:

- **Combinators** — `not`, `either`, `allOf`, `arrayOf`. Composition is
  the next layer up, not the simplest one.
- **Configurable predicates** — `isGreaterThan(n)`, `matches(re)`. These
  are factories, not predicates.
- **Format validators** — `isEmail`, `isUrl`, `isUuid`. These carry
  specs, edge cases, and opinions that go stale.
- **Schemas, error messages, coercion, and parsing.** A predicate answers
  yes or no and says nothing about why.

Those belong in a higher-level package that can depend on this one.

## Contributing

See the
[CONTRIBUTING guide](https://github.com/zachlysobey/z-megarepo/blob/master/simple-predicates/docs/CONTRIBUTING.md)
for setup and development scripts.

## Packaging

Published as ESM-only with bundled type declarations, built into `dist/`
by `npm run build`. Runtime-agnostic (browsers, Node, Bun, Deno,
workers), with `sideEffects: false` so bundlers can tree-shake unused
exports.

## License

[MIT](https://github.com/zachlysobey/z-megarepo/blob/master/simple-predicates/LICENSE)
— unlike the rest of the surrounding monorepo, which is GPL-3.0-or-later,
this package is MIT-licensed to encourage adoption.
