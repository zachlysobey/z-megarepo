import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filter } from './filter.ts';

const isEven = (n: number) => n % 2 === 0;
const isString = (value: unknown): value is string => typeof value === 'string';

describe('filter', () => {
  it('keeps the elements the predicate accepts', () => {
    assert.deepEqual(filter(isEven)([1, 2, 3, 4]), [2, 4]);
  });

  it('does not mutate its input', () => {
    const values = [1, 2, 3];
    filter(isEven)(values);
    assert.deepEqual(values, [1, 2, 3]);
  });

  it('calls the predicate with the element only', () => {
    const calls: unknown[][] = [];
    const record = (...args: unknown[]) => {
      calls.push(args);
      return true;
    };
    filter(record)(['a', 'b']);
    assert.deepEqual(calls, [['a'], ['b']]);
  });

  it('narrows through a type guard', () => {
    const mixed: unknown[] = ['a', 1, 'b'];
    const strings: string[] = filter(isString)(mixed);
    assert.deepEqual(strings, ['a', 'b']);
  });

  it('accepts a readonly array', () => {
    const values: readonly number[] = [1, 2, 3];
    assert.deepEqual(filter(isEven)(values), [2]);
  });
});
