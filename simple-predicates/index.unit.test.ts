import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import vm from 'node:vm';
import * as api from './index.ts';
import { isNumber, isString, type SimplePredicate } from './index.ts';

const samples = {
  'empty string': '',
  'blank string': ' \t\n ',
  string: 'abc',
  zero: 0,
  'negative zero': -0,
  integer: 42,
  'negative integer': -7,
  float: 1.5,
  'unsafe integer': Number.MAX_SAFE_INTEGER + 2,
  infinity: Infinity,
  'negative infinity': -Infinity,
  nan: NaN,
  true: true,
  false: false,
  bigint: 1n,
  'bigint zero': 0n,
  symbol: Symbol('sample'),
  null: null,
  undefined: undefined,
  'empty array': [],
  array: [1, 2],
  'empty object': {},
  object: { a: 1 },
  'null-prototype object': Object.create(null),
  'class instance': new (class Thing {})(),
  function: () => {},
  date: new Date(0),
  map: new Map(),
};

const numbers = [
  'zero',
  'negative zero',
  'integer',
  'negative integer',
  'float',
  'unsafe integer',
];

const everything = Object.keys(samples);

const allBut = (...excluded: string[]) =>
  everything.filter((label) => !excluded.includes(label));

/**
 * The labels each predicate accepts, in `samples` order. `satisfies`
 * makes this exhaustive: a new export without an entry, or an entry
 * naming something that is not exported, fails to compile.
 */
const acceptance = {
  isString: ['empty string', 'blank string', 'string'],
  isNumber: [...numbers, 'infinity', 'negative infinity'],
  isBoolean: ['true', 'false'],
  isBigInt: ['bigint', 'bigint zero'],
  isSymbol: ['symbol'],
  isNull: ['null'],
  isUndefined: ['undefined'],
  isNil: ['null', 'undefined'],
  isNotNil: allBut('null', 'undefined'),
  isTruthy: allBut(
    'empty string',
    'zero',
    'negative zero',
    'nan',
    'false',
    'bigint zero',
    'null',
    'undefined',
  ),
  isFalsy: [
    'empty string',
    'zero',
    'negative zero',
    'nan',
    'false',
    'bigint zero',
    'null',
    'undefined',
  ],
  isObject: [
    'empty array',
    'array',
    'empty object',
    'object',
    'null-prototype object',
    'class instance',
    'date',
    'map',
  ],
  isArray: ['empty array', 'array'],
  isPlainObject: ['empty object', 'object', 'null-prototype object'],
  isFunction: ['function'],
  isFiniteNumber: numbers,
  isInteger: [
    'zero',
    'negative zero',
    'integer',
    'negative integer',
    'unsafe integer',
  ],
  isSafeInteger: ['zero', 'negative zero', 'integer', 'negative integer'],
  isEmptyString: ['empty string'],
  isNonEmptyString: ['blank string', 'string'],
  isBlankString: ['empty string', 'blank string'],
  isEmptyArray: ['empty array'],
  isNonEmptyArray: ['array'],
} satisfies Record<keyof typeof api, readonly string[]>;

/** Compile-time proof that every export honors the base contract. */
const predicates: Record<string, SimplePredicate> = api;

for (const [name, accepted] of Object.entries(acceptance)) {
  describe(name, () => {
    it('accepts exactly the expected sample values', () => {
      const actual = everything.filter((label) =>
        predicates[name]!(samples[label as keyof typeof samples]),
      );
      assert.deepEqual(actual, accepted);
    });
  });
}

describe('type narrowing', () => {
  it('narrows an array of unknowns through filter', () => {
    const mixed: unknown[] = ['a', 1, 'b'];
    const strings: string[] = mixed.filter(isString);
    assert.deepEqual(strings, ['a', 'b']);
  });
  it('narrows a union in a conditional', () => {
    const measure = (value: number | string) =>
      isNumber(value) ? value + 1 : value.length;
    assert.deepEqual([measure(41), measure('abc')], [42, 3]);
  });
  it('keeps a function callable with its required parameters', () => {
    const call = (handler: string | ((a: string, b: number) => string)) =>
      api.isFunction(handler) ? handler('x', 1) : handler;
    assert.equal(
      call((a, b) => `${a}${b}`),
      'x1',
    );
  });
});

describe('isObject', () => {
  it('accepts an arguments object, which is not an array', () => {
    const argumentsObject = (function (..._args: unknown[]) {
      return arguments;
    })(1, 2);
    assert.deepEqual(
      [api.isObject(argumentsObject), api.isArray(argumentsObject)],
      [true, false],
    );
  });
});

describe('isFunction', () => {
  it('accepts every function value', () => {
    const functions = [
      class Thing {},
      function named() {},
      async () => {},
      function* generator() {},
    ];
    assert.deepEqual(functions.map(api.isFunction), [true, true, true, true]);
  });
  it('does not promise that a function value is callable', () => {
    // A class is a function value but has no [[Call]], so the JSDoc says
    // a true result proves the value is a function, not that calling it
    // will work. This pins that wording to the actual behaviour.
    class Thing {}
    assert.equal(api.isFunction(Thing), true);
    assert.throws(() => (Thing as unknown as () => void)(), TypeError);
  });
});

describe('isPlainObject', () => {
  it('accepts a plain object from another realm, which instanceof cannot check', () => {
    const otherRealm = vm.runInNewContext('({ a: 1 })');
    assert.equal(Object.getPrototypeOf(otherRealm) === Object.prototype, false);
    assert.equal(api.isPlainObject(otherRealm), true);
  });
  it('rejects an arguments object, whose prototype is Object.prototype', () => {
    const argumentsObject = (function (..._args: unknown[]) {
      return arguments;
    })(1, 2);
    assert.equal(
      Object.getPrototypeOf(argumentsObject) === Object.prototype,
      true,
    );
    assert.deepEqual(
      [api.isObject(argumentsObject), api.isPlainObject(argumentsObject)],
      [true, false],
    );
  });
  it('rejects an object whose prototype is a null-prototype object', () => {
    const nested = Object.create(
      Object.assign(Object.create(null), { inherited: 1 }),
    );
    assert.equal(api.isPlainObject(nested), false);
  });
  it('does not count a tagged object literal as plain', () => {
    assert.equal(api.isPlainObject({ [Symbol.toStringTag]: 'Map' }), false);
  });
});

describe('isTruthy', () => {
  it('rejects falsy values', () => {
    assert.deepEqual([0, '', false, NaN, 0n].map(api.isTruthy), [
      false,
      false,
      false,
      false,
      false,
    ]);
  });
  it('rejects falsy values that isNotNil accepts, which is why both exist', () => {
    assert.deepEqual([0, '', false, NaN, 0n].map(api.isNotNil), [
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});

describe('documented limits', () => {
  it('a Proxy engineered to throw when read defeats the predicates', () => {
    const hostileArray = new Proxy([1, 2], {
      get: (target, key) => {
        if (key === 'length') {
          throw new Error('engineered to throw');
        }
        return target[key as never];
      },
    });
    assert.throws(() => api.isNonEmptyArray(hostileArray));
  });
});
