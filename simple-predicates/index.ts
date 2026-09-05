/**
 * A test on a single unknown value.
 *
 * Every predicate in this package satisfies this contract: it takes
 * exactly one argument of any type, returns a `boolean`, never mutates,
 * and depends on nothing but its argument.
 *
 * Predicates do not throw, with one unavoidable exception: a value
 * engineered to throw when its brand is read or when it is coerced — a
 * `Proxy` with a throwing trap, say — defeats any check that has to look
 * at it. These predicates describe shape, not provenance, and are not a
 * security boundary.
 */
export type SimplePredicate = (value: unknown) => boolean;

/**
 * A {@link SimplePredicate} that also narrows its argument to `T`, so a
 * `true` result refines the value's type at the call site.
 *
 * Every `NarrowingPredicate` is a `SimplePredicate`; the reverse does not
 * hold. Note that the narrowing is lost when one is stored as the base
 * type, so annotate with `NarrowingPredicate` wherever the call site
 * should narrow.
 */
export type NarrowingPredicate<T> = (value: unknown) => value is T;

const brandOf = (value: unknown): string =>
  Object.prototype.toString.call(value).slice(8, -1);

/** `typeof value === 'string'`. */
export const isString = (value: unknown): value is string =>
  typeof value === 'string';

/** `typeof value === 'number'`, excluding `NaN`. */
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value);

/** `typeof value === 'boolean'`. */
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

/** `typeof value === 'bigint'`. */
export const isBigInt = (value: unknown): value is bigint =>
  typeof value === 'bigint';

/** `typeof value === 'symbol'`. */
export const isSymbol = (value: unknown): value is symbol =>
  typeof value === 'symbol';

/** `value === null`. */
export const isNull = (value: unknown): value is null => value === null;

/** `value === undefined`. */
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

/** `null` or `undefined`. */
export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/** Anything other than `null` or `undefined`. */
export const isNotNil = (value: unknown): value is {} =>
  value !== null && value !== undefined;

/**
 * A value that JavaScript coerces to `true`.
 *
 * Truthiness is a question about a value, not about its type, so this
 * does not narrow. Use `isNotNil` when the goal is to drop `null` and
 * `undefined` from a type.
 */
export const isTruthy: SimplePredicate = (value) => Boolean(value);

/**
 * A value that JavaScript coerces to `false`.
 *
 * Does not narrow: `NaN` is falsy, but its type is `number`, which no
 * union of falsy literal types can soundly express.
 */
export const isFalsy: SimplePredicate = (value) => !value;

/**
 * Any non-null object, including arrays, dates, and class instances, but
 * not functions.
 */
export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

/**
 * An object literal or a `Object.create(null)` object — an object whose
 * prototype is `Object.prototype` or `null`. Arrays, dates, class
 * instances, and functions are not plain objects.
 */
export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (!isObject(value) || brandOf(value) !== 'Object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) {
    return true;
  }
  // Walking to the root rather than comparing against `Object.prototype`
  // keeps this true for objects created in another realm, which have
  // their own `Object.prototype`.
  let root = prototype;
  while (Object.getPrototypeOf(root) !== null) {
    root = Object.getPrototypeOf(root);
  }
  return prototype === root;
};

/** An array of any element type. */
export const isArray = (value: unknown): value is readonly unknown[] =>
  Array.isArray(value);

/**
 * Any callable value.
 *
 * Narrows to a signature that accepts no arguments and returns `unknown`,
 * so a guarded value can be passed around and identity-checked without
 * the guard implying anything false about how it may be called.
 */
export const isFunction = (
  value: unknown,
): value is (...args: never[]) => unknown => typeof value === 'function';

/** A `Date`, excluding an invalid one (a `Date` whose time is `NaN`). */
export const isDate = (value: unknown): value is Date =>
  brandOf(value) === 'Date' && !Number.isNaN(Number(value));

/** A `RegExp`. */
export const isRegExp = (value: unknown): value is RegExp =>
  brandOf(value) === 'RegExp';

/** An `Error`, including subclasses such as `TypeError`. */
export const isError = (value: unknown): value is Error =>
  brandOf(value) === 'Error';

/** A native `Promise`. Non-native thenables are not promises. */
export const isPromise = (value: unknown): value is Promise<unknown> =>
  brandOf(value) === 'Promise';

/** A `Map`. */
export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  brandOf(value) === 'Map';

/** A `Set`. */
export const isSet = (value: unknown): value is Set<unknown> =>
  brandOf(value) === 'Set';

/** A number that is neither `NaN` nor `Infinity` nor `-Infinity`. */
export const isFiniteNumber = (value: unknown): value is number =>
  Number.isFinite(value);

/** A finite number with no fractional part. */
export const isInteger = (value: unknown): value is number =>
  Number.isInteger(value);

/** An integer exactly representable as a JavaScript number. */
export const isSafeInteger = (value: unknown): value is number =>
  Number.isSafeInteger(value);

/** The empty string. */
export const isEmptyString = (value: unknown): value is string =>
  isString(value) && value.length === 0;

/** A string with at least one character. */
export const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.length > 0;

/** A string that is empty or contains only whitespace. */
export const isBlankString = (value: unknown): value is string =>
  isString(value) && value.trim().length === 0;

/** An array with no elements. */
export const isEmptyArray = (value: unknown): value is readonly unknown[] =>
  isArray(value) && value.length === 0;

/** An array with at least one element. */
export const isNonEmptyArray = (value: unknown): value is readonly unknown[] =>
  isArray(value) && value.length > 0;
