import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compose } from './compose.ts';
import { filter } from './filter.ts';
import { map } from './map.ts';

const double = (n: number) => n * 2;
const increment = (n: number) => n + 1;
const stringify = (n: number) => `${n}`;
const length = (s: string) => s.length;
const isEven = (n: number) => n % 2 === 0;

describe('compose', () => {
  it('applies right to left', () => {
    assert.equal(compose(double, increment)(3), 8);
  });

  it('is not left to right', () => {
    assert.notEqual(compose(double, increment)(3), increment(double(3)));
  });

  it('returns a single function unwrapped', () => {
    assert.equal(compose(double), double);
  });

  it('is associative, so pipelines nest freely', () => {
    const flat = compose(length, stringify, double);
    const leftNested = compose(compose(length, stringify), double);
    const rightNested = compose(length, compose(stringify, double));
    assert.deepEqual(
      [flat(50), leftNested(50), rightNested(50)],
      [length(stringify(double(50))), 3, 3],
    );
  });

  it('builds a pipeline up incrementally without currying', () => {
    const inner = compose(stringify, double);
    const outer = compose(length, inner);
    assert.deepEqual([inner(50), outer(50)], ['100', 3]);
  });

  it('is reusable and leaves the functions it composed untouched', () => {
    const pipeline = compose(increment, double);
    assert.deepEqual([pipeline(5), pipeline(5), double(5)], [11, 11, 10]);
  });

  it('throws when given no functions', () => {
    assert.throws(() => (compose as () => unknown)(), TypeError);
  });

  it('runs over a function value like any other input', () => {
    const arity = compose((fn: (...args: never[]) => unknown) => fn.length);
    assert.equal(arity((_a: never, _b: never) => 0), 2);
  });

  it('composes curried helpers point-free', () => {
    const evenDoubles = compose(map(double), filter(isEven));
    assert.deepEqual(evenDoubles([1, 2, 3, 4]), [4, 8]);
  });

  it('threads the element type through a five-stage pipeline', () => {
    const pipeline = compose(stringify, length, stringify, double, increment);
    assert.equal(pipeline(4), '2');
  });
});
