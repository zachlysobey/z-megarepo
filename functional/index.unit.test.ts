import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as api from './index.ts';
import { compose, isIn, map, reject, type Unary } from './index.ts';

describe('public surface', () => {
  it('exports exactly the documented helpers', () => {
    assert.deepEqual(Object.keys(api).sort(), [
      'complement',
      'compose',
      'filter',
      'isIn',
      'map',
      'reject',
    ]);
  });
});

describe('point-free composition', () => {
  it('reads as a single pipeline of curried helpers', () => {
    const allowed = ['a', 'b'] as const;
    const summarize: Unary<readonly string[], number[]> = compose(
      map((s: string) => s.length),
      reject(isIn(allowed)),
    );
    assert.deepEqual(summarize(['a', 'ccc', 'b', 'dd']), [3, 2]);
  });
});
