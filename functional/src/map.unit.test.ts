import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { map } from './map.ts';

const double = (n: number) => n * 2;
const length = (s: string) => s.length;

describe('map', () => {
  it('applies the function to every element', () => {
    assert.deepEqual(map(double)([1, 2, 3]), [2, 4, 6]);
  });

  it('calls the function with the element only', () => {
    const calls: unknown[][] = [];
    const record = (...args: unknown[]) => {
      calls.push(args);
      return args[0];
    };
    map(record)(['a', 'b']);
    assert.deepEqual(calls, [['a'], ['b']]);
  });

  it('is immune to the extra arguments that trip up Array.prototype.map', () => {
    const input = ['1', '2', '3'];
    assert.deepEqual(map(Number.parseInt)(input), [1, 2, 3]);
    assert.deepEqual(input.map(Number.parseInt), [1, NaN, NaN]);
  });

  it('does not mutate its input', () => {
    const values = [1, 2, 3];
    map(double)(values);
    assert.deepEqual(values, [1, 2, 3]);
  });

  it('changes the element type', () => {
    const lengths: number[] = map(length)(['a', 'bc']);
    assert.deepEqual(lengths, [1, 2]);
  });

  it('accepts a readonly array', () => {
    const values: readonly number[] = [1, 2];
    assert.deepEqual(map(double)(values), [2, 4]);
  });
});
