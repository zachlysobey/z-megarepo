import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { complement } from './complement.ts';

const isEven = (n: number) => n % 2 === 0;

describe('complement', () => {
  it('negates a predicate', () => {
    assert.deepEqual([1, 2].map(complement(isEven)), [true, false]);
  });

  it('is its own inverse', () => {
    const roundTrip = complement(complement(isEven));
    assert.deepEqual([1, 2].map(roundTrip), [1, 2].map(isEven));
  });

  it('does not call the predicate until applied', () => {
    let calls = 0;
    complement(() => {
      calls += 1;
      return true;
    });
    assert.equal(calls, 0);
  });
});
