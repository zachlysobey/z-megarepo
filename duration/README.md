# duration

A small, dependency-light TypeScript library for representing, converting,
and normalizing fixed durations. It builds on
[`time-units`](../time-units), reusing its scalar unit-conversion
constants and functions rather than duplicating them.

The entire implementation is a single TypeScript file:
[`index.ts`](https://github.com/zachlysobey/z-megarepo/blob/master/duration/index.ts).

## Usage

```ts
import {
  balanceDuration,
  durationToHours,
  durationToMilliseconds,
  hoursToDuration,
  millisecondsToDuration,
} from "z-duration";

durationToMilliseconds({ minutes: 1, seconds: 30 }); // 90_000
durationToHours({ days: 1, hours: 12 }); // 36

millisecondsToDuration(90_000); // { minutes: 1, seconds: 30 }
hoursToDuration(49); // { days: 2, hours: 1 }

balanceDuration({ days: 3, hours: 48 }); // { days: 5 }
```

## The `Duration` type

A `Duration` is a plain object with one or more of the supported unit
fields: `milliseconds`, `seconds`, `minutes`, `hours`, `days`. It must
contain at least one field, and it is not required to be balanced:

```ts
const a: Duration = { days: 3 };
const b: Duration = { hours: 2, minutes: 30 };
const c: Duration = { days: 3, hours: 48 }; // valid, unbalanced
const invalid: Duration = {}; // type error
```

Field values are ordinary `number`s: fractional and negative values are
valid and are never rounded, rejected, or coerced.

A day always means exactly 24 elapsed hours — this package has no
calendar, timezone, or date awareness (see [Package boundaries](#package-boundaries)).

## API

### Duration to scalar

Each function reduces a full, possibly-unbalanced `Duration` into a
single scalar unit. Missing fields count as zero.

- `durationToMilliseconds(duration)`
- `durationToSeconds(duration)`
- `durationToMinutes(duration)`
- `durationToHours(duration)`
- `durationToDays(duration)`

```ts
durationToDays({ days: 3, hours: 48 }); // 5
```

### Scalar to Duration

Each function converts a scalar quantity into a balanced `Duration`,
expressed using the largest appropriate units, with any remainder carried
into smaller units rather than rounded away.

- `millisecondsToDuration(milliseconds)`
- `secondsToDuration(seconds)`
- `minutesToDuration(minutes)`
- `hoursToDuration(hours)`
- `daysToDuration(days)`

```ts
hoursToDuration(1.5); // { hours: 1, minutes: 30 }
```

### `balanceDuration(duration)`

Normalizes an arbitrary, possibly-unbalanced `Duration` into canonical
form: the largest appropriate units, zero-valued fields omitted.

```ts
balanceDuration({ minutes: 90, seconds: 30 });
// { hours: 1, minutes: 30, seconds: 30 }
```

`balanceDuration` is normalization, not rounding — it never discards
part of the represented value.

## Semantics

- **Balancing order**: days → hours → minutes → seconds → milliseconds,
  using the fixed relationships from `time-units` (1 day = 24 hours,
  1 hour = 60 minutes, 1 minute = 60 seconds, 1 second = 1000
  milliseconds).
- **Zero-valued fields are omitted** from a balanced result, e.g.
  `hoursToDuration(24)` returns `{ days: 1 }`, not
  `{ days: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }`. The
  one exception is a duration that nets to exactly zero, which is
  reported as `{ milliseconds: 0 }` so the result still satisfies the
  `Duration` type's at-least-one-field requirement.
- **Negative durations** are valid and unrestricted. Balancing truncates
  toward zero at each unit, so every field in a balanced result shares
  the same sign — e.g. `minutesToDuration(-1.5)` returns
  `{ minutes: -1, seconds: -30 }`, never a duration whose fields disagree
  in sign or that changes the represented value.
- **Fractional values** are valid and are never rounded. Any remainder
  that can't be expressed in a larger unit is carried down to smaller
  units, and a remainder too small even for milliseconds is left exactly
  as ordinary JavaScript floating-point arithmetic produces it.

## Package boundaries

`duration` represents and transforms fixed elapsed-time durations. It
does not know about dates, timestamps, timezones, or calendars, and it
has no parsing, formatting, or rounding policy. Operations like
`addDuration(duration)(date)`, `nextMonday(...)`, `parseDuration(...)`,
`formatDuration(...)`, or `roundDuration(...)` belong in a separate,
higher-level package.

## Mutability

All operations are pure: no argument is mutated, and every function
returns a new value.

## Contributing

See the
[CONTRIBUTING guide](https://github.com/zachlysobey/z-megarepo/blob/master/duration/docs/CONTRIBUTING.md)
for setup and development scripts.

## Packaging

Published as ESM-only with bundled type declarations, built into `dist/`
by `npm run build`. Runtime-agnostic (browsers, Node, Bun, Deno,
workers), with `sideEffects: false` so bundlers can tree-shake unused
exports.

## License

[MIT](https://github.com/zachlysobey/z-megarepo/blob/master/duration/LICENSE)
— unlike the rest of the surrounding monorepo, which is GPL-3.0-or-later,
this package is MIT-licensed to encourage adoption.
