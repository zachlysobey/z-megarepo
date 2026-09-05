/**
 * A test on a single unknown value.
 *
 * Every predicate in this package satisfies this contract: it takes
 * exactly one argument of any type, returns a `boolean`, never throws,
 * never mutates, and depends on nothing but its argument.
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

/** `typeof value === 'string'`. */
export declare const isString: NarrowingPredicate<string>;

/** `typeof value === 'number'`, excluding `NaN`. */
export declare const isNumber: NarrowingPredicate<number>;

/** `typeof value === 'boolean'`. */
export declare const isBoolean: NarrowingPredicate<boolean>;

/** `typeof value === 'bigint'`. */
export declare const isBigInt: NarrowingPredicate<bigint>;

/** `typeof value === 'symbol'`. */
export declare const isSymbol: NarrowingPredicate<symbol>;

/** `value === null`. */
export declare const isNull: NarrowingPredicate<null>;

/** `value === undefined`. */
export declare const isUndefined: NarrowingPredicate<undefined>;

/** `null` or `undefined`. */
export declare const isNil: NarrowingPredicate<null | undefined>;

/** Anything other than `null` or `undefined`. */
export declare const isNotNil: NarrowingPredicate<{}>;

/**
 * A value that JavaScript coerces to `true`.
 *
 * Truthiness is a question about a value, not about its type, so this
 * does not narrow. Use `isNotNil` when the goal is to drop `null` and
 * `undefined` from a type.
 */
export declare const isTruthy: SimplePredicate;

/**
 * A value that JavaScript coerces to `false`.
 *
 * Does not narrow: `NaN` is falsy, but its type is `number`, which no
 * union of falsy literal types can soundly express.
 */
export declare const isFalsy: SimplePredicate;

/**
 * Any non-null object, including arrays, dates, and class instances, but
 * not functions.
 */
export declare const isObject: NarrowingPredicate<object>;

/**
 * An object literal or a `Object.create(null)` object — an object whose
 * prototype is `Object.prototype` or `null`. Arrays, dates, class
 * instances, and functions are not plain objects.
 */
export declare const isPlainObject: NarrowingPredicate<Record<string, unknown>>;

/** An array of any element type. */
export declare const isArray: NarrowingPredicate<readonly unknown[]>;

/**
 * Any callable value.
 *
 * Narrows to a signature that accepts no arguments and returns `unknown`,
 * so a guarded value can be passed around and identity-checked without
 * the guard implying anything false about how it may be called.
 */
export declare const isFunction: NarrowingPredicate<(...args: never[]) => unknown>;

/** A `Date`, excluding an invalid one (a `Date` whose time is `NaN`). */
export declare const isDate: NarrowingPredicate<Date>;

/** A `RegExp`. */
export declare const isRegExp: NarrowingPredicate<RegExp>;

/** An `Error`, including subclasses such as `TypeError`. */
export declare const isError: NarrowingPredicate<Error>;

/** A native `Promise`. Non-native thenables are not promises. */
export declare const isPromise: NarrowingPredicate<Promise<unknown>>;

/** A `Map`. */
export declare const isMap: NarrowingPredicate<Map<unknown, unknown>>;

/** A `Set`. */
export declare const isSet: NarrowingPredicate<Set<unknown>>;

/** A number that is neither `NaN` nor `Infinity` nor `-Infinity`. */
export declare const isFiniteNumber: NarrowingPredicate<number>;

/** A finite number with no fractional part. */
export declare const isInteger: NarrowingPredicate<number>;

/** An integer exactly representable as a JavaScript number. */
export declare const isSafeInteger: NarrowingPredicate<number>;

/** The empty string. */
export declare const isEmptyString: NarrowingPredicate<string>;

/** A string with at least one character. */
export declare const isNonEmptyString: NarrowingPredicate<string>;

/** A string that is empty or contains only whitespace. */
export declare const isBlankString: NarrowingPredicate<string>;

/** An array with no elements. */
export declare const isEmptyArray: NarrowingPredicate<readonly unknown[]>;

/** An array with at least one element. */
export declare const isNonEmptyArray: NarrowingPredicate<readonly unknown[]>;
