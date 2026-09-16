/**
 * A function of exactly one argument.
 *
 * Every helper in this package is built from unary functions and returns
 * unary functions, which is what makes them composable without glue.
 */
export type Unary<In, Out> = (value: In) => Out;

/**
 * A pipeline built by {@link compose}.
 *
 * Calling it with a function extends the pipeline; calling it with
 * anything else runs the pipeline on that value. So `compose(a, b, c)`,
 * `compose(a, b)(c)` and `compose(a)(b)(c)` all describe the same
 * pipeline, and each new function is added at the input end.
 *
 * The function/value distinction is made at runtime by `typeof`, so a
 * pipeline whose own input is a function value must be run via
 * {@link Composed.run}, which never extends.
 */
export interface Composed<In, Out> {
  <NewIn>(fn: Unary<NewIn, In>): Composed<NewIn, Out>;
  (value: In): Out;
  /** Runs the pipeline, even when its input is itself a function. */
  readonly run: Unary<In, Out>;
}

/**
 * Composes unary functions right to left: `compose(a, b, c)(x)` is
 * `a(b(c(x)))`.
 *
 * The result is a {@link Composed} pipeline, so it can be extended one
 * function at a time instead of all at once.
 *
 * Throws a `TypeError` when called with no functions, as there is no
 * meaningful pipeline to build.
 */
export interface Compose {
  <A, B>(a: Unary<A, B>): Composed<A, B>;
  <A, B, C>(b: Unary<B, C>, a: Unary<A, B>): Composed<A, C>;
  <A, B, C, D>(c: Unary<C, D>, b: Unary<B, C>, a: Unary<A, B>): Composed<A, D>;
  <A, B, C, D, E>(
    d: Unary<D, E>,
    c: Unary<C, D>,
    b: Unary<B, C>,
    a: Unary<A, B>,
  ): Composed<A, E>;
  <A, B, C, D, E, F>(
    e: Unary<E, F>,
    d: Unary<D, E>,
    c: Unary<C, D>,
    b: Unary<B, C>,
    a: Unary<A, B>,
  ): Composed<A, F>;
}

const composer = (
  pipeline: Unary<unknown, unknown>,
): Composed<unknown, unknown> => {
  const composed = (arg: unknown) =>
    typeof arg === 'function'
      ? composer((value) => pipeline((arg as Unary<unknown, unknown>)(value)))
      : pipeline(arg);
  composed.run = pipeline;
  return composed as Composed<unknown, unknown>;
};

const composeImpl = (
  ...fns: ReadonlyArray<Unary<unknown, unknown>>
): Composed<unknown, unknown> => {
  const [first, ...rest] = fns;
  if (first === undefined) {
    throw new TypeError('compose requires at least one function');
  }
  return rest.reduce<Composed<unknown, unknown>>(
    (pipeline, fn) => pipeline(fn),
    composer(first),
  );
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
