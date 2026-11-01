import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { complement } from './complement.ts';
import { filter } from './filter.ts';
import { reject } from './reject.ts';

const isEven = (n: number) => n % 2 === 0;

describe('reject', () => {
  it('drops the elements the predicate accepts', () => {
    assert.deepEqual(reject(isEven)([1, 2, 3, 4]), [1, 3]);
  });

  it('partitions an array together with filter, preserving order', () => {
    const values = [1, 2, 3, 4, 5];
    const kept = filter(isEven)(values);
    const dropped = reject(isEven)(values);
    assert.deepEqual(kept, [2, 4]);
    assert.deepEqual(dropped, [1, 3, 5]);
    assert.deepEqual([...kept, ...dropped].sort(), values);
  });

  it('equals filter of the complement', () => {
    const values = [1, 2, 3, 4];
    assert.deepEqual(reject(isEven)(values), filter(complement(isEven))(values));
  });

  it('does not mutate its input', () => {
    const values = [1, 2, 3];
    reject(isEven)(values);
    assert.deepEqual(values, [1, 2, 3]);
  });
});
