import type { Unary } from './Unary.ts';

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
export function compose<A, B>(a: Unary<A, B>): Unary<A, B>;
export function compose<A, B, C>(b: Unary<B, C>, a: Unary<A, B>): Unary<A, C>;
export function compose<A, B, C, D>(
  c: Unary<C, D>,
  b: Unary<B, C>,
  a: Unary<A, B>,
): Unary<A, D>;
export function compose<A, B, C, D, E>(
  d: Unary<D, E>,
  c: Unary<C, D>,
  b: Unary<B, C>,
  a: Unary<A, B>,
): Unary<A, E>;
export function compose<A, B, C, D, E, F>(
  e: Unary<E, F>,
  d: Unary<D, E>,
  c: Unary<C, D>,
  b: Unary<B, C>,
  a: Unary<A, B>,
): Unary<A, F>;
export function compose(
  ...fns: ReadonlyArray<Unary<unknown, unknown>>
): Unary<unknown, unknown> {
  if (fns.length === 0) {
    throw new TypeError('compose requires at least one function');
  }
  return fns.reduce((outer, inner) => (value) => outer(inner(value)));
}
