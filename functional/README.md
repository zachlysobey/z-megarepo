# z-functional

A tiny, dependency-free TypeScript library of curried functional helpers.
Every export is curried and data-last, so partial application is the
normal way to use it and point-free pipelines need no glue code.

The entire implementation is a single TypeScript file:
[`index.ts`](https://github.com/zachlysobey/z-megarepo/blob/master/functional/index.ts).

## Usage

```ts
import { compose, filter, isIn, map, reject } from "z-functional";

const allowed = ["draft", "live"] as const;

const publishedLengths = compose(
  map((s: string) => s.length),
  filter(isIn(allowed)),
);

publishedLengths(["draft", "archived", "live"]); // [5, 4]
```

## Currying

Helpers take their configuration first and their data last:

```ts
map(fn)(values);
filter(predicate)(values);
reject(predicate)(values);
isIn(allowed)(value);
```

Currying is strict — one argument per call. There is no Ramda-style
auto-currying where `map(fn, values)` also works, because a single
unambiguous shape is easier to type and to read.

## compose

`compose` runs right to left, so `compose(a, b, c)(x)` is `a(b(c(x)))`.

A pipeline can be built all at once or one function at a time. These are
the same pipeline:

```ts
compose(a, b, c);
compose(a, b)(c);
compose(a)(b)(c);
```

Calling a pipeline with a **function** extends it; calling it with
**anything else** runs it. Each added function joins at the input end,
so the reading order never changes.

### Running a pipeline over a function value

The extend-or-run decision is made at runtime with `typeof`, which leaves
one ambiguity: a pipeline whose *input* is itself a function. Use `.run`,
which always runs and never extends:

```ts
const arity = compose((fn: Function) => fn.length);

arity.run((a, b) => a + b); // 2
arity((a, b) => a + b);     // a longer pipeline, not 2
```

This only matters when the value flowing into a pipeline is a function.
For every other input, calling the pipeline directly is correct.

## filter, reject, and complement

`reject` is the exact opposite of `filter`, and is implemented that way
rather than duplicated:

```ts
const reject = (predicate) => filter(complement(predicate));
```

`complement` negates a predicate and is exported in its own right, since
it is useful anywhere a predicate needs inverting.

`filter` preserves type narrowing; `reject` cannot, because TypeScript
has no "not `T`" type:

```ts
filter(isString)(mixed); // string[]
reject(isString)(mixed); // unknown[]
```

## API

| Export | Signature | Notes |
| --- | --- | --- |
| `compose` | `compose(...fns)` | Right to left; extends on a function |
| `map` | `map(fn)(values)` | Calls `fn` with the element only |
| `filter` | `filter(predicate)(values)` | Narrows through type guards |
| `reject` | `reject(predicate)(values)` | `filter` of the complement |
| `complement` | `complement(predicate)(value)` | Negates a predicate |
| `isIn` | `isIn(allowed)(value)` | Membership; narrows to the element type |

Types: `Unary<In, Out>`, `Composed<In, Out>`, `Compose`, `Filter`.

See [`index.ts`](./index.ts) for exact signatures and semantics.

## Semantics

- **Callbacks receive one argument.** `map(fn)` and `filter(fn)` call
  `fn` with the element alone, never the index or source array, so
  `map(Number.parseInt)` gives `[1, 2, 3]` where
  `Array.prototype.map` gives `[1, NaN, NaN]`.
- **Nothing is mutated.** Every helper returns a new array or function.
- **`isIn` compares with `Array.prototype.includes`**, so `NaN` matches
  itself and `0` matches `-0`. Objects compare by reference.
- **`compose()` with no functions throws a `TypeError`**, as there is no
  pipeline to build.

## Package boundaries

This is the first slice of a library meant to grow one helper at a time.
Deliberately absent for now, and likely to arrive later:

- **`pipe`** — left-to-right composition, the other half of `compose`.
- **More collection helpers** — `reduce`, `find`, `flatMap`, `sort`.
- **Property access** — `prop`, `pluck`, `path`.
- **Currying utilities** — `curry`, `partial`, `flip`.

Deliberately absent on principle:

- **Type predicates** — `isString`, `isNumber` and friends live in
  [`z-simple-predicates`](https://www.npmjs.com/package/z-simple-predicates),
  which composes with this package but is not a dependency of it.
- **Auto-currying and variadic callbacks** — see [Currying](#currying).
- **Lazy sequences, transducers, and immutable data structures.** Those
  are a different library with a different cost model.

## Contributing

See the
[CONTRIBUTING guide](https://github.com/zachlysobey/z-megarepo/blob/master/functional/docs/CONTRIBUTING.md)
for setup and development scripts.

## Packaging

Published as ESM-only with bundled type declarations, built into `dist/`
by `npm run build`. Runtime-agnostic (browsers, Node, Bun, Deno,
workers), with `sideEffects: false` so bundlers can tree-shake unused
exports.

## License

[MIT](https://github.com/zachlysobey/z-megarepo/blob/master/functional/LICENSE)
— unlike the rest of the surrounding monorepo, which is GPL-3.0-or-later,
this package is MIT-licensed to encourage adoption.
