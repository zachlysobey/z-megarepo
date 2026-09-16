import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as api from './index.ts';
import {
  complement,
  compose,
  filter,
  isIn,
  map,
  reject,
  type Unary,
} from './index.ts';

const double = (n: number) => n * 2;
const increment = (n: number) => n + 1;
const stringify = (n: number) => `${n}`;
const length = (s: string) => s.length;
const isEven = (n: number) => n % 2 === 0;
const isString = (value: unknown): value is string => typeof value === 'string';

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

describe('compose', () => {
  it('applies right to left', () => {
    assert.equal(compose(double, increment)(3), 8);
  });

  it('is not left to right', () => {
    assert.notEqual(compose(double, increment)(3), increment(double(3)));
  });

  it('builds the same pipeline variadically, curried, or mixed', () => {
    const variadic = compose(length, stringify, double);
    const curried = compose(length)(stringify)(double);
    const mixed = compose(length, stringify)(double);
    assert.deepEqual(
      [variadic(50), curried(50), mixed(50)],
      [length(stringify(double(50))), 3, 3],
    );
  });

  it('adds each new function at the input end', () => {
    const shout = (s: string) => `${s}!`;
    const wrap = (s: string) => `[${s}]`;
    assert.equal(compose(shout)(wrap)('hi'), '[hi]!');
  });

  it('returns an equivalent of a single function unchanged', () => {
    assert.equal(compose(double)(21), 42);
  });

  it('is reusable and does not mutate an existing pipeline', () => {
    const base = compose(double);
    const extended = base(increment);
    assert.deepEqual([base(5), extended(5), base(5)], [10, 12, 10]);
  });

  it('throws when given no functions', () => {
    assert.throws(() => (compose as () => unknown)(), TypeError);
  });

  it('runs a pipeline whose input is a function value via run', () => {
    const arity = compose((fn: (...args: never[]) => unknown) => fn.length);
    assert.equal(arity.run((_a: never, _b: never) => 0), 2);
  });

  it('extends rather than applies when handed a function, hence run', () => {
    const arity = compose((fn: (...args: never[]) => unknown) => fn.length);
    const extended = arity((_a: never, _b: never) => 0);
    assert.equal(typeof extended, 'function');
    assert.notEqual(extended, 2);
  });

  it('composes curried helpers point-free', () => {
    const evenDoubles = compose(map(double), filter(isEven));
    assert.deepEqual(evenDoubles([1, 2, 3, 4]), [4, 8]);
  });
});

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
});

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
    assert.deepEqual([isIn([item])(item), isIn([item])({ id: 1 })], [
      true,
      false,
    ]);
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
});

describe('point-free composition', () => {
  it('reads as a single pipeline of curried helpers', () => {
    const allowed = ['a', 'b'] as const;
    const summarize: Unary<readonly string[], number[]> = compose(
      map(length),
      reject(isIn(allowed)),
    );
    assert.deepEqual(summarize(['a', 'ccc', 'b', 'dd']), [3, 2]);
  });
});
