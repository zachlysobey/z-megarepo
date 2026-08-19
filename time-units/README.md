# time-units

A tiny, dependency-free TypeScript library for converting between fixed units of elapsed time.

This package is intentionally low-level and "dumb." It performs straightforward numeric unit conversions and exposes the conversion factors used to do so. It does **not** perform date arithmetic, calendar arithmetic, duration balancing, rounding, parsing, formatting, validation, or timezone-aware operations.

This README is both user documentation and an implementation specification.

## Design goals

`time-units` should be:

- tiny
- predictable
- dependency-free
- fully typed
- mechanically regular
- easy to reimplement from this specification
- suitable for use as a foundational package by higher-level time/date libraries
- independently publishable

The implementation should prefer simple arithmetic over abstractions or cleverness.

## Supported units

The initial public API supports exactly these units:

- milliseconds
- seconds
- minutes
- hours
- days

Weeks and smaller-than-millisecond units are intentionally out of scope for now.

A `day` in this package means exactly **24 hours**. It does not mean a calendar day and has no relationship to daylight-saving transitions, timezones, or local dates.

## Numeric semantics

All values are ordinary JavaScript `number` values.

Functions should accept `number` and return `number`.

Do not:

- validate inputs
- coerce strings
- restrict values to integers
- reject negative values
- reject `Infinity`
- reject `NaN`
- round results
- compensate for IEEE-754 floating-point behavior

Fractional values should work naturally through ordinary JavaScript arithmetic.

For example:

```ts
minutesToSeconds(1.5); // 90
secondsToMinutes(30); // 0.5
```

## Public constants

Expose conversion-factor constants only in the direction:

> **smaller units per larger unit**

Do not expose inverse fractional constants such as `MINUTES_PER_SECOND`.

Do not expose identity constants such as `SECONDS_PER_SECOND`.

### Base constants

These are the primitive/base relationships:

```ts
export const MILLISECONDS_PER_SECOND = 1_000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
```

### Derived constants

All larger-span constants should be derived from the primitive constants rather than duplicating numeric literals.

The complete public constant API is:

```ts
export const MILLISECONDS_PER_SECOND = 1_000;

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

export const MILLISECONDS_PER_MINUTE =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;

export const MILLISECONDS_PER_HOUR =
  MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_HOUR * HOURS_PER_DAY;

export const SECONDS_PER_HOUR =
  SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export const SECONDS_PER_DAY =
  SECONDS_PER_HOUR * HOURS_PER_DAY;

export const MINUTES_PER_DAY =
  MINUTES_PER_HOUR * HOURS_PER_DAY;
```

This is the complete cross-product of meaningful **smaller-per-larger** relationships among the supported units.

## Conversion functions

Expose a conversion function for every ordered pair of **distinct** supported units.

With five supported units, this produces 20 conversion functions.

Naming is always:

```txt
<pluralSourceUnit>To<PluralTargetUnit>
```

Examples:

```ts
secondsToMilliseconds
minutesToHours
daysToSeconds
millisecondsToDays
```

Always use full unit names.

Do not use abbreviations such as:

```txt
ms
millis
secs
mins
hrs
```

Both source and destination names are plural.

Do not expose identity conversions such as `secondsToSeconds`.

### Required API

#### From milliseconds

```ts
export const millisecondsToSeconds = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_SECOND;

export const millisecondsToMinutes = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_MINUTE;

export const millisecondsToHours = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_HOUR;

export const millisecondsToDays = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_DAY;
```

#### From seconds

```ts
export const secondsToMilliseconds = (seconds: number) =>
  seconds * MILLISECONDS_PER_SECOND;

export const secondsToMinutes = (seconds: number) =>
  seconds / SECONDS_PER_MINUTE;

export const secondsToHours = (seconds: number) =>
  seconds / SECONDS_PER_HOUR;

export const secondsToDays = (seconds: number) =>
  seconds / SECONDS_PER_DAY;
```

#### From minutes

```ts
export const minutesToMilliseconds = (minutes: number) =>
  minutes * MILLISECONDS_PER_MINUTE;

export const minutesToSeconds = (minutes: number) =>
  minutes * SECONDS_PER_MINUTE;

export const minutesToHours = (minutes: number) =>
  minutes / MINUTES_PER_HOUR;

export const minutesToDays = (minutes: number) =>
  minutes / MINUTES_PER_DAY;
```

#### From hours

```ts
export const hoursToMilliseconds = (hours: number) =>
  hours * MILLISECONDS_PER_HOUR;

export const hoursToSeconds = (hours: number) =>
  hours * SECONDS_PER_HOUR;

export const hoursToMinutes = (hours: number) =>
  hours * MINUTES_PER_HOUR;

export const hoursToDays = (hours: number) =>
  hours / HOURS_PER_DAY;
```

#### From days

```ts
export const daysToMilliseconds = (days: number) =>
  days * MILLISECONDS_PER_DAY;

export const daysToSeconds = (days: number) =>
  days * SECONDS_PER_DAY;

export const daysToMinutes = (days: number) =>
  days * MINUTES_PER_DAY;

export const daysToHours = (days: number) =>
  days * HOURS_PER_DAY;
```

## Implementation rules

Conversion functions should perform exactly one multiplication or division against the appropriate named conversion constant.

Prefer:

```ts
export const hoursToSeconds = (hours: number) =>
  hours * SECONDS_PER_HOUR;
```

over:

```ts
export const hoursToSeconds = (hours: number) =>
  hours * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
```

and over:

```ts
export const hoursToSeconds = (hours: number) => hours * 3_600;
```

The public derived constants therefore act as the single named conversion factors for the functions.

The implementation should not introduce:

- lookup tables
- classes
- unit enums
- generic `convert()` functions
- runtime unit strings
- validation helpers
- rounding helpers
- wrapper objects

Those could be introduced by other packages if needed.

## Example usage

```ts
import {
  HOURS_PER_DAY,
  daysToHours,
  hoursToMinutes,
  millisecondsToSeconds,
  minutesToMilliseconds,
} from "time-units";

minutesToMilliseconds(5);
// 300_000

millisecondsToSeconds(1_500);
// 1.5

daysToHours(2);
// 48

hoursToMinutes(1.5);
// 90

HOURS_PER_DAY;
// 24
```

## Expected constant values

An implementation should produce these values:

```ts
MILLISECONDS_PER_SECOND === 1_000;

MILLISECONDS_PER_MINUTE === 60_000;
MILLISECONDS_PER_HOUR === 3_600_000;
MILLISECONDS_PER_DAY === 86_400_000;

SECONDS_PER_MINUTE === 60;
SECONDS_PER_HOUR === 3_600;
SECONDS_PER_DAY === 86_400;

MINUTES_PER_HOUR === 60;
MINUTES_PER_DAY === 1_440;

HOURS_PER_DAY === 24;
```

## Testing expectations

The package should be testable using Node's native test runner and `node:assert`.

At minimum, tests should establish:

1. every public constant has the expected value
2. every conversion function correctly converts a representative positive value
3. inverse conversion pairs round-trip representative values within ordinary JavaScript floating-point semantics
4. fractional inputs are preserved
5. zero works
6. negative values work without special handling

Representative assertions:

```ts
assert.equal(secondsToMilliseconds(1), 1_000);
assert.equal(minutesToSeconds(2), 120);
assert.equal(hoursToMinutes(1.5), 90);
assert.equal(daysToHours(-2), -48);
assert.equal(millisecondsToSeconds(500), 0.5);
```

Do not add tests asserting custom handling of invalid inputs because the library intentionally has no validation layer.

## Package boundaries

This package deals only with scalar time-unit conversion.

The following belong in other libraries:

### Structured durations

Examples:

```ts
type Duration = {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
};
```

Operations such as:

```ts
durationToMilliseconds(...)
millisecondsToDuration(...)
balanceDuration(...)
```

are outside this package.

### Date/timestamp arithmetic

Operations such as:

```ts
addDuration(duration)(date)
subtractDuration(duration)(date)
```

are outside this package.

### Duration rounding

Operations that introduce rounding policy, such as rounding a duration to the nearest second or hour, are outside this package.

### Calendar operations

This package must not contain functionality such as:

```ts
startOfDay(...)
isToday(...)
nextMonday(...)
addCalendarDays(...)
```

Calendar operations require semantics that are intentionally absent here.

## Dependencies and tooling

The package should have:

- no runtime dependencies
- no package-local devDependencies unless a concrete need emerges

In a monorepo, formatting, linting, TypeScript configuration, builds, and other development tooling may be managed from the repository root.

The package should preserve the option of being published independently in the future.

## Philosophy

When deciding whether something belongs in `time-units`, use this test:

> Can the operation be described entirely as arithmetic between fixed scalar units of elapsed time?

If yes, it may belong here.

If it requires dates, timestamps, calendars, timezones, parsing, formatting, balancing structured durations, rounding policy, or contextual interpretation, it belongs in a higher-level package.

The ideal implementation of `time-units` should feel almost boring.

## Development

```bash
nvm use && npm install
npm test
npm run typecheck
npm run build
```

## Packaging

The published package is ESM-only with bundled type declarations, built by
`npm run build` into `dist/` and exposed through the `exports` map. It is
runtime-agnostic (browsers, Node, Bun, Deno, workers) and declares
`sideEffects: false` so bundlers can tree-shake unused exports.

## License

[MIT](./LICENSE) — unlike the rest of the surrounding monorepo, which is
GPL-3.0-or-later, this package is MIT-licensed to encourage adoption.
