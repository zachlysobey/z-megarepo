import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import vm from 'node:vm';
import * as api from './index.ts';
import { isDate, isString, type SimplePredicate } from './index.ts';

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
  'invalid date': new Date('not a date'),
  regexp: /x/,
  error: new Error('sample'),
  'type error': new TypeError('sample'),
  promise: Promise.resolve(),
  map: new Map(),
  set: new Set(),
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
  isBigInt: ['bigint'],
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
    'null',
    'undefined',
  ),
  isFalsy: [
    'empty string',
    'zero',
    'negative zero',
    'nan',
    'false',
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
    'invalid date',
    'regexp',
    'error',
    'type error',
    'promise',
    'map',
    'set',
  ],
  isPlainObject: ['empty object', 'object', 'null-prototype object'],
  isArray: ['empty array', 'array'],
  isFunction: ['function'],
  isDate: ['date'],
  isRegExp: ['regexp'],
  isError: ['error', 'type error'],
  isPromise: ['promise'],
  isMap: ['map'],
  isSet: ['set'],
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

const otherRealm = vm.runInNewContext(`({
  date: new Date(0),
  array: [1, 2],
  regexp: /x/,
  error: new Error('sample'),
  promise: Promise.resolve(),
  map: new Map(),
  set: new Set(),
  plainObject: { a: 1 },
})`);

describe('cross-realm values', () => {
  it('are not recognized by instanceof, which is why brands are used', () => {
    assert.equal(otherRealm.date instanceof Date, false);
  });
  it('are recognized by the built-in predicates', () => {
    assert.deepEqual(
      {
        date: api.isDate(otherRealm.date),
        array: api.isArray(otherRealm.array),
        regexp: api.isRegExp(otherRealm.regexp),
        error: api.isError(otherRealm.error),
        promise: api.isPromise(otherRealm.promise),
        map: api.isMap(otherRealm.map),
        set: api.isSet(otherRealm.set),
        plainObject: api.isPlainObject(otherRealm.plainObject),
      },
      {
        date: true,
        array: true,
        regexp: true,
        error: true,
        promise: true,
        map: true,
        set: true,
        plainObject: true,
      },
    );
  });
});

describe('type narrowing', () => {
  it('narrows an array of unknowns through filter', () => {
    const mixed: unknown[] = ['a', 1, 'b'];
    const strings: string[] = mixed.filter(isString);
    assert.deepEqual(strings, ['a', 'b']);
  });
  it('narrows a union in a conditional', () => {
    const measure = (value: Date | string) =>
      isDate(value) ? value.getTime() : value.length;
    assert.deepEqual([measure(new Date(0)), measure('abc')], [0, 3]);
  });
});

const spoofedMap = { [Symbol.toStringTag]: 'Map' };
const spoofedDate = { [Symbol.toStringTag]: 'Date' };
const hostileDate = {
  [Symbol.toStringTag]: 'Date',
  valueOf: () => {
    throw new Error('engineered to throw');
  },
};
const argumentsObject = (function (..._args: unknown[]) {
  return arguments;
})(1, 2);

describe('brand spoofing', () => {
  it('accepts a value that claims a brand it does not have', () => {
    assert.equal(api.isMap(spoofedMap), true);
  });
  it('rejects a spoofed date, because its time still reads as NaN', () => {
    assert.equal(api.isDate(spoofedDate), false);
  });
  it('does not count a tagged object literal as a plain object', () => {
    assert.equal(api.isPlainObject(spoofedMap), false);
  });
});

describe('documented limits', () => {
  it('a value engineered to throw on coercion defeats isDate', () => {
    assert.throws(() => api.isDate(hostileDate));
  });
});

describe('isPlainObject', () => {
  it('rejects an arguments object, which is neither plain nor an array', () => {
    assert.deepEqual(
      [
        api.isObject(argumentsObject),
        api.isPlainObject(argumentsObject),
        api.isArray(argumentsObject),
      ],
      [true, false, false],
    );
  });
});

describe('isPromise', () => {
  it('rejects a non-native thenable', () => {
    assert.equal(api.isPromise({ then: () => {} }), false);
  });
});

describe('isError', () => {
  it('accepts a custom Error subclass', () => {
    class CustomError extends Error {}
    assert.equal(api.isError(new CustomError('sample')), true);
  });
});

describe('isFunction', () => {
  it('accepts every flavor of callable', () => {
    const callables = [
      class Thing {},
      function named() {},
      async () => {},
      function* generator() {},
    ];
    assert.deepEqual(callables.map(api.isFunction), [true, true, true, true]);
  });
});

describe('isTruthy', () => {
  it('rejects falsy values', () => {
    assert.deepEqual([0, '', false, NaN].map(api.isTruthy), [
      false,
      false,
      false,
      false,
    ]);
  });
  it('rejects falsy values that isNotNil accepts, which is why both exist', () => {
    assert.deepEqual([0, '', false, NaN].map(api.isNotNil), [
      true,
      true,
      true,
      true,
    ]);
  });
});

describe('narrowing a union member', () => {
  it('keeps a function callable with its required parameters', () => {
    const call = (handler: string | ((a: string, b: number) => string)) =>
      api.isFunction(handler) ? handler('x', 1) : handler;
    assert.equal(
      call((a, b) => `${a}${b}`),
      'x1',
    );
  });
  it('keeps a map usable at its own key and value types', () => {
    const lookUp = (entries: string | Map<string, number>) =>
      api.isMap(entries) ? entries.get('a') : entries.length;
    assert.equal(lookUp(new Map([['a', 1]])), 1);
  });
  it('keeps a set usable at its own element type', () => {
    const contains = (numbers: string | Set<number>) =>
      api.isSet(numbers) ? numbers.has(1) : false;
    assert.equal(contains(new Set([1])), true);
  });
});
