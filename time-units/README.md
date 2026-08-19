# time-units

A tiny, dependency-free TypeScript library for converting between fixed
units of elapsed time: milliseconds, seconds, minutes, hours, and days.

The entire implementation is a single TypeScript file:
[`index.ts`](https://github.com/zachlysobey/z-megarepo/blob/master/time-units/index.ts).

## Usage

```ts
import {
  HOURS_PER_DAY,
  daysToHours,
  hoursToMinutes,
  millisecondsToSeconds,
  minutesToMilliseconds,
} from "z-time-units";

minutesToMilliseconds(5); // 300_000
millisecondsToSeconds(1_500); // 1.5
daysToHours(2); // 48
hoursToMinutes(1.5); // 90
HOURS_PER_DAY; // 24
```

## API

### Constants

Every smaller-per-larger relationship among the supported units:

| Constant                  | Value        |
| ------------------------- | ------------ |
| `MILLISECONDS_PER_SECOND` | `1_000`      |
| `MILLISECONDS_PER_MINUTE` | `60_000`     |
| `MILLISECONDS_PER_HOUR`   | `3_600_000`  |
| `MILLISECONDS_PER_DAY`    | `86_400_000` |
| `SECONDS_PER_MINUTE`      | `60`         |
| `SECONDS_PER_HOUR`        | `3_600`      |
| `SECONDS_PER_DAY`         | `86_400`     |
| `MINUTES_PER_HOUR`        | `60`         |
| `MINUTES_PER_DAY`         | `1_440`      |
| `HOURS_PER_DAY`           | `24`         |

### Conversion functions

One function for every ordered pair of distinct units, each with the
signature `(value: number) => number`:

- `millisecondsToSeconds`
- `millisecondsToMinutes`
- `millisecondsToHours`
- `millisecondsToDays`
- `secondsToMilliseconds`
- `secondsToMinutes`
- `secondsToHours`
- `secondsToDays`
- `minutesToMilliseconds`
- `minutesToSeconds`
- `minutesToHours`
- `minutesToDays`
- `hoursToMilliseconds`
- `hoursToSeconds`
- `hoursToMinutes`
- `hoursToDays`
- `daysToMilliseconds`
- `daysToSeconds`
- `daysToMinutes`
- `daysToHours`

Each performs a single multiplication or division against one of the
constants above. Fractional, negative, and zero values flow through
ordinary JavaScript arithmetic:

```ts
minutesToSeconds(1.5); // 90
secondsToMinutes(30); // 0.5
daysToHours(-2); // -48
```

## Semantics

- A `day` is exactly 24 hours. No calendars, timezones, or
  daylight-saving transitions.
- Values are plain `number`s in and out. No validation, coercion,
  rounding, parsing, or formatting.
- Dates, timestamps, structured durations, and calendar operations
  belong in higher-level libraries.

## Contributing

See the
[CONTRIBUTING guide](https://github.com/zachlysobey/z-megarepo/blob/master/time-units/docs/CONTRIBUTING.md)
for setup and development scripts.

## Packaging

Published as ESM-only with bundled type declarations, built into `dist/`
by `npm run build`. Runtime-agnostic (browsers, Node, Bun, Deno,
workers), with `sideEffects: false` so bundlers can tree-shake unused
exports.

## License

[MIT](https://github.com/zachlysobey/z-megarepo/blob/master/time-units/LICENSE)
— unlike the rest of the surrounding monorepo, which is GPL-3.0-or-later,
this package is MIT-licensed to encourage adoption.
