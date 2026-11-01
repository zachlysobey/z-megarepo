import type { Unary } from './Unary.ts';

/**
 * Keeps the elements a predicate accepts.
 *
 * Two signatures, mirroring `Array.prototype.filter`:
 * - pass a type guard (`isString`) and the result narrows (`string[]`)
 * - pass any other predicate and the element type is unchanged
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
// Implementation signature — not visible to callers.
export function filter<In>(
  predicate: Unary<In, boolean>,
): Unary<readonly In[], In[]> {
  return (values) => values.filter((value) => predicate(value));
}
