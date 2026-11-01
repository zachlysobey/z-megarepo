import { complement } from './complement.ts';
import { filter } from './filter.ts';
import type { Unary } from './Unary.ts';

/**
 * Drops the elements a predicate accepts — the exact complement of
 * `filter`, and implemented as such.
 *
 * Does not narrow, for the reason given on `complement`.
 */
export const reject = <In>(
  predicate: Unary<In, boolean>,
): Unary<readonly In[], In[]> => filter(complement(predicate));
