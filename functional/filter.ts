import type { Unary } from './Unary.ts';

/**
 * Keeps the elements a predicate accepts.
 *
 * Preserves narrowing: `filter(isString)` applied to `unknown[]` gives
 * `string[]`. The two signatures exist because TypeScript cannot infer a
 * guarded type from a predicate that is not a type guard.
 *
 * The predicate is called with the element only — never the index or the
 * source array.
 */
export function filter<In, Out extends In>(
  predicate: (value: In) => value is Out,
): Unary<readonly In[], Out[]>;
export function filter<In>(
  predicate: Unary<In, boolean>,
): Unary<readonly In[], In[]>;
export function filter<In>(
  predicate: Unary<In, boolean>,
): Unary<readonly In[], In[]> {
  return (values) => values.filter((value) => predicate(value));
}
