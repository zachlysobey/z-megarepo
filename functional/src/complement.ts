import type { Unary } from './Unary.ts';

/**
 * Negates a predicate: `complement(p)(x)` is `!p(x)`.
 *
 * This is what makes `reject` the exact opposite of `filter` rather than
 * a second implementation of it.
 *
 * Narrowing cannot survive negation — TypeScript has no "not `T`" type —
 * so the result is a plain boolean predicate.
 */
export const complement =
  <In>(predicate: Unary<In, boolean>): Unary<In, boolean> =>
  (value) =>
    !predicate(value);
