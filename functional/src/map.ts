import type { Unary } from './Unary.ts';

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
