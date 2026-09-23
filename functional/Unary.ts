/**
 * A function of exactly one argument.
 *
 * Every helper in this package takes and returns unary functions, which
 * is what lets them compose without glue.
 */
export type Unary<In, Out> = (value: In) => Out;
