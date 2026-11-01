import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filter } from './filter.ts';
import { isIn } from './isIn.ts';
import { reject } from './reject.ts';

describe('isIn', () => {
  it('tests membership of the allowed values', () => {
    const isVowel = isIn(['a', 'e', 'i', 'o', 'u']);
    assert.deepEqual(['a', 'z'].map(isVowel), [true, false]);
  });

  it('is empty-safe', () => {
    assert.equal(isIn([])('a'), false);
  });

  it('matches NaN with itself, unlike ===', () => {
    assert.equal(isIn([NaN])(NaN), true);
  });

  it('does not distinguish 0 from -0', () => {
    assert.equal(isIn([0])(-0), true);
  });

  it('compares objects by reference', () => {
    const item = { id: 1 };
    assert.deepEqual(
      [isIn([item])(item), isIn([item])({ id: 1 })],
      [true, false],
    );
  });

  it('narrows to the element type through filter', () => {
    const allowed = ['draft', 'live'] as const;
    const statuses: Array<'draft' | 'live'> = filter(isIn(allowed))([
      'draft',
      'archived',
      'live',
    ]);
    assert.deepEqual(statuses, ['draft', 'live']);
  });

  it('leaves the input type intact through reject', () => {
    const allowed = ['draft', 'live'] as const;
    const others: string[] = reject(isIn(allowed))(['draft', 'archived']);
    assert.deepEqual(others, ['archived']);
  });
});
