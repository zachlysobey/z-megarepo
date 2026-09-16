# z-functional

A tiny, dependency-free TypeScript library of curried functional helpers
for point-free pipelines.

One module per helper, each named after its single export, re-exported
from [`index.ts`](https://github.com/zachlysobey/z-megarepo/blob/master/functional/index.ts).

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

`compose` is the one exception: it is variadic rather than curried. See
below for why.

## compose

`compose` runs right to left, so `compose(a, b, c)(x)` is `a(b(c(x)))`.

The result is an ordinary unary function, which is what makes pipelines
compose with each other. Building one up in stages needs no special
support:

```ts
const inner = compose(stringify, double);
const outer = compose(length, inner);
```

Composition is associative, so these are all the same pipeline:

```ts
compose(a, b, c);
compose(compose(a, b), c);
compose(a, compose(b, c));
```

A single function is returned unwrapped, so `compose(a) === a`.

### Why compose is not curried

The other helpers are curried because they take two different kinds of
argument: configuration first, data last. `compose` takes only one kind,
so there is no partially applied state worth stopping at — and the thing
currying would buy, building a pipeline incrementally, already works
because a pipeline is just a function.

A curried `compose(a)(b)` would also be undecidable at runtime: given a
function, it cannot know whether you are extending the pipeline or
running it on a function value. Staying variadic removes the question.

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
| `compose` | `compose(...fns)(value)` | Right to left; associative |
| `map` | `map(fn)(values)` | Calls `fn` with the element only |
| `filter` | `filter(predicate)(values)` | Narrows through type guards |
| `reject` | `reject(predicate)(values)` | `filter` of the complement |
| `complement` | `complement(predicate)(value)` | Negates a predicate |
| `isIn` | `isIn(allowed)(value)` | Membership; narrows to the element type |

The only exported type is `Unary<In, Out>`.

Each helper lives in its own module — see `compose.ts`, `filter.ts` and
friends for exact signatures and semantics.

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
- **No type assertions.** The implementation contains no `as` casts, so
  the types the API advertises are the types it actually enforces.

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
