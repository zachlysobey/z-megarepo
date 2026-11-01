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
export const isIn = <T>(values: readonly T[]) => {
  const candidates: readonly unknown[] = values;
  return <In>(value: In): value is In & T => candidates.includes(value);
};
