/**
 * A function of exactly one argument.
 *
 * Every helper in this package is built from unary functions and returns
 * unary functions, which is what makes them composable without glue.
 */
export type Unary<In, Out> = (value: In) => Out;

/**
 * Composes unary functions right to left: `compose(a, b, c)(x)` is
 * `a(b(c(x)))`.
 *
 * The result is an ordinary unary function, so pipelines nest without
 * ceremony — `compose(a, compose(b, c))` is `compose(a, b, c)` — and a
 * single function is returned unwrapped.
 *
 * Deliberately not curried: every argument is the same kind of thing, so
 * there is no configuration to partially apply, and `compose(a)(b)` would
 * be indistinguishable from running the pipeline on a function value.
 *
 * Throws a `TypeError` when called with no functions, as there is no
 * pipeline to build.
 */
export interface Compose {
  <A, B>(a: Unary<A, B>): Unary<A, B>;
  <A, B, C>(b: Unary<B, C>, a: Unary<A, B>): Unary<A, C>;
  <A, B, C, D>(c: Unary<C, D>, b: Unary<B, C>, a: Unary<A, B>): Unary<A, D>;
  <A, B, C, D, E>(
    d: Unary<D, E>,
    c: Unary<C, D>,
    b: Unary<B, C>,
    a: Unary<A, B>,
  ): Unary<A, E>;
  <A, B, C, D, E, F>(
    e: Unary<E, F>,
    d: Unary<D, E>,
    c: Unary<C, D>,
    b: Unary<B, C>,
    a: Unary<A, B>,
  ): Unary<A, F>;
}

const composeImpl = (
  ...fns: ReadonlyArray<Unary<unknown, unknown>>
): Unary<unknown, unknown> => {
  if (fns.length === 0) {
    throw new TypeError('compose requires at least one function');
  }
  return fns.reduce((outer, inner) => (value) => outer(inner(value)));
};

/** See {@link Compose}. */
export const compose = composeImpl as Compose;

/**
 * Negates a predicate: `complement(p)(x)` is `!p(x)`.
 *
 * This is the helper that makes {@link reject} the exact opposite of
 * {@link filter} rather than a second implementation of it.
 *
 * Narrowing cannot survive negation — TypeScript has no "not `T`" type —
 * so the result is a plain boolean predicate.
 */
export const complement =
  <In>(predicate: Unary<In, boolean>): Unary<In, boolean> =>
  (value) =>
    !predicate(value);

/**
 * Keeps the elements a predicate accepts.
 *
 * Preserves narrowing: `filter(isString)` applied to `unknown[]` gives
 * `string[]`.
 */
export interface Filter {
  <In, Out extends In>(
    predicate: (value: In) => value is Out,
  ): Unary<readonly In[], Out[]>;
  <In>(predicate: Unary<In, boolean>): Unary<readonly In[], In[]>;
}

const filterImpl =
  <In>(predicate: Unary<In, boolean>): Unary<readonly In[], In[]> =>
  (values) =>
    values.filter((value) => predicate(value));

/** See {@link Filter}. */
export const filter = filterImpl as Filter;

/**
 * Drops the elements a predicate accepts — the exact complement of
 * {@link filter}, and implemented as such.
 *
 * Does not narrow, for the reason given on {@link complement}.
 */
export const reject = <In>(
  predicate: Unary<In, boolean>,
): Unary<readonly In[], In[]> => filterImpl(complement(predicate));

/**
 * Applies a function to every element.
 *
 * The function is called with the element only — never the index or the
 * source array — so partially applied helpers cannot be corrupted by
 * arguments they did not ask for.
 */
export const map =
  <In, Out>(fn: Unary<In, Out>): Unary<readonly In[], Out[]> =>
  (values) =>
    values.map((value) => fn(value));

/**
 * Tests membership of a fixed set of allowed values:
 * `isIn(allowed)(value)`.
 *
 * Accepts a value of any type and narrows it to the array's element
 * type, so `filter(isIn(allowed))` yields an array of allowed values
 * while `reject(isIn(allowed))` keeps the type it was given.
 *
 * Comparison is `Array.prototype.includes`, so `NaN` matches itself and
 * `0` matches `-0`; everything else is reference/value identity.
 */
export const isIn =
  <T>(values: readonly T[]) =>
  <In>(value: In): value is In & T =>
    (values as readonly unknown[]).includes(value);
