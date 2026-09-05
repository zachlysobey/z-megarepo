/**
 * A test on a single unknown value, narrowing it to `T`.
 *
 * Every predicate in this package satisfies the same contract: it takes
 * exactly one argument of any type, returns a `boolean`, never throws,
 * never mutates, and depends on nothing but its argument.
 */
export type SimplePredicate<T = unknown> = (value: unknown) => value is T;

/** `typeof value === 'string'`. */
export declare const isString: SimplePredicate<string>;

/** `typeof value === 'number'`, excluding `NaN`. */
export declare const isNumber: SimplePredicate<number>;

/** `typeof value === 'boolean'`. */
export declare const isBoolean: SimplePredicate<boolean>;

/** `typeof value === 'bigint'`. */
export declare const isBigInt: SimplePredicate<bigint>;

/** `typeof value === 'symbol'`. */
export declare const isSymbol: SimplePredicate<symbol>;

/** `value === null`. */
export declare const isNull: SimplePredicate<null>;

/** `value === undefined`. */
export declare const isUndefined: SimplePredicate<undefined>;

/** `null` or `undefined`. */
export declare const isNil: SimplePredicate<null | undefined>;

/** Anything other than `null` or `undefined`. */
export declare const isNotNil: SimplePredicate<{}>;

/**
 * Any non-null object, including arrays, dates, and class instances, but
 * not functions.
 */
export declare const isObject: SimplePredicate<object>;

/**
 * An object literal or a `Object.create(null)` object — an object whose
 * prototype is `Object.prototype` or `null`. Arrays, dates, class
 * instances, and functions are not plain objects.
 */
export declare const isPlainObject: SimplePredicate<Record<string, unknown>>;

/** An array of any element type. */
export declare const isArray: SimplePredicate<readonly unknown[]>;

/**
 * Any callable value.
 *
 * Narrows to a signature that accepts no arguments and returns `unknown`,
 * so a guarded value can be passed around and identity-checked without
 * the guard implying anything false about how it may be called.
 */
export declare const isFunction: SimplePredicate<(...args: never[]) => unknown>;

/** A `Date`, excluding an invalid one (a `Date` whose time is `NaN`). */
export declare const isDate: SimplePredicate<Date>;

/** A `RegExp`. */
export declare const isRegExp: SimplePredicate<RegExp>;

/** An `Error`, including subclasses such as `TypeError`. */
export declare const isError: SimplePredicate<Error>;

/** A native `Promise`. Non-native thenables are not promises. */
export declare const isPromise: SimplePredicate<Promise<unknown>>;

/** A `Map`. */
export declare const isMap: SimplePredicate<Map<unknown, unknown>>;

/** A `Set`. */
export declare const isSet: SimplePredicate<Set<unknown>>;

/** A number that is neither `NaN` nor `Infinity` nor `-Infinity`. */
export declare const isFiniteNumber: SimplePredicate<number>;

/** A finite number with no fractional part. */
export declare const isInteger: SimplePredicate<number>;

/** An integer exactly representable as a JavaScript number. */
export declare const isSafeInteger: SimplePredicate<number>;

/** The empty string. */
export declare const isEmptyString: SimplePredicate<string>;

/** A string with at least one character. */
export declare const isNonEmptyString: SimplePredicate<string>;

/** A string that is empty or contains only whitespace. */
export declare const isBlankString: SimplePredicate<string>;

/** An array with no elements. */
export declare const isEmptyArray: SimplePredicate<readonly unknown[]>;

/** An array with at least one element. */
export declare const isNonEmptyArray: SimplePredicate<readonly unknown[]>;
