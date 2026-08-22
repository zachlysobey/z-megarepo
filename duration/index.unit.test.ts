import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  durationToMilliseconds,
  durationToSeconds,
  durationToMinutes,
  durationToHours,
  durationToDays,
  millisecondsToDuration,
  secondsToDuration,
  minutesToDuration,
  hoursToDuration,
  daysToDuration,
  balanceDuration,
} from './index.ts';

describe('durationToMilliseconds', () => {
  it('sums all present fields', () => {
    assert.equal(durationToMilliseconds({ minutes: 1, seconds: 30 }), 90_000);
  });
  it('treats missing fields as zero', () => {
    assert.equal(durationToMilliseconds({ hours: 1 }), 3_600_000);
  });
  it('does not require the duration to be balanced', () => {
    assert.equal(durationToMilliseconds({ days: 3, hours: 48 }), 432_000_000);
  });
  it('preserves fractional values', () => {
    assert.equal(durationToMilliseconds({ seconds: 0.25 }), 250);
  });
  it('preserves negative values', () => {
    assert.equal(durationToMilliseconds({ minutes: -30 }), -1_800_000);
  });
});

describe('durationToSeconds', () => {
  it('converts a structured duration to seconds', () => {
    assert.equal(durationToSeconds({ minutes: 1, seconds: 30 }), 90);
  });
});

describe('durationToMinutes', () => {
  it('converts a structured duration to minutes', () => {
    assert.equal(durationToMinutes({ hours: 1, minutes: 30 }), 90);
  });
});

describe('durationToHours', () => {
  it('converts a structured, unbalanced duration to hours', () => {
    assert.equal(durationToHours({ days: 1, hours: 12 }), 36);
  });
});

describe('durationToDays', () => {
  it('converts a structured, unbalanced duration to days', () => {
    assert.equal(durationToDays({ days: 3, hours: 48 }), 5);
  });
});

describe('millisecondsToDuration', () => {
  it('balances into the largest appropriate units', () => {
    assert.deepEqual(millisecondsToDuration(90_000), {
      minutes: 1,
      seconds: 30,
    });
  });
  it('omits zero-valued fields', () => {
    assert.deepEqual(millisecondsToDuration(3_600_000), { hours: 1 });
  });
  it('reports a zero duration as { milliseconds: 0 }', () => {
    assert.deepEqual(millisecondsToDuration(0), { milliseconds: 0 });
  });
});

describe('secondsToDuration', () => {
  it('balances into the largest appropriate units', () => {
    assert.deepEqual(secondsToDuration(90), { minutes: 1, seconds: 30 });
  });
});

describe('minutesToDuration', () => {
  it('balances into the largest appropriate units', () => {
    assert.deepEqual(minutesToDuration(90), { hours: 1, minutes: 30 });
  });
  it('preserves a negative fractional remainder without a sign flip', () => {
    assert.deepEqual(minutesToDuration(-1.5), { minutes: -1, seconds: -30 });
  });
});

describe('hoursToDuration', () => {
  it('balances into days and hours', () => {
    assert.deepEqual(hoursToDuration(49), { days: 2, hours: 1 });
  });
  it('preserves a fractional remainder in a smaller unit', () => {
    assert.deepEqual(hoursToDuration(1.5), { hours: 1, minutes: 30 });
  });
});

describe('daysToDuration', () => {
  it('wraps an already-balanced value', () => {
    assert.deepEqual(daysToDuration(3), { days: 3 });
  });
});

describe('balanceDuration', () => {
  it('normalizes an unbalanced duration', () => {
    assert.deepEqual(balanceDuration({ days: 3, hours: 48 }), { days: 5 });
  });
  it('carries a remainder down through every present unit', () => {
    assert.deepEqual(balanceDuration({ minutes: 90, seconds: 30 }), {
      hours: 1,
      minutes: 30,
      seconds: 30,
    });
  });
  it('omits zero-valued fields rather than padding them in', () => {
    assert.deepEqual(balanceDuration({ hours: 48 }), { days: 2 });
  });
  it('preserves fractional remainder rather than rounding it away', () => {
    assert.deepEqual(balanceDuration({ minutes: 1.5 }), {
      minutes: 1,
      seconds: 30,
    });
  });
  it('normalizes a duration whose fields cancel out to zero', () => {
    assert.deepEqual(balanceDuration({ hours: 1, minutes: -60 }), {
      milliseconds: 0,
    });
  });
});

describe('round-trips', () => {
  it('duration to milliseconds and back', () => {
    const duration = { hours: 2, minutes: 15 };
    assert.deepEqual(
      millisecondsToDuration(durationToMilliseconds(duration)),
      duration,
    );
  });
  it('scalar to duration and back', () => {
    assert.equal(durationToHours(hoursToDuration(49)), 49);
  });
});
