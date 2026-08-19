import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE,
  MINUTES_PER_HOUR,
  HOURS_PER_DAY,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_DAY,
  MINUTES_PER_DAY,
  millisecondsToSeconds,
  millisecondsToMinutes,
  millisecondsToHours,
  millisecondsToDays,
  secondsToMilliseconds,
  secondsToMinutes,
  secondsToHours,
  secondsToDays,
  minutesToMilliseconds,
  minutesToSeconds,
  minutesToHours,
  minutesToDays,
  hoursToMilliseconds,
  hoursToSeconds,
  hoursToMinutes,
  hoursToDays,
  daysToMilliseconds,
  daysToSeconds,
  daysToMinutes,
  daysToHours,
} from './index.ts';

describe('constants', () => {
  it('milliseconds per second', () => {
    assert.equal(MILLISECONDS_PER_SECOND, 1_000);
  });
  it('seconds per minute', () => {
    assert.equal(SECONDS_PER_MINUTE, 60);
  });
  it('minutes per hour', () => {
    assert.equal(MINUTES_PER_HOUR, 60);
  });
  it('hours per day', () => {
    assert.equal(HOURS_PER_DAY, 24);
  });
  it('milliseconds per minute', () => {
    assert.equal(MILLISECONDS_PER_MINUTE, 60_000);
  });
  it('milliseconds per hour', () => {
    assert.equal(MILLISECONDS_PER_HOUR, 3_600_000);
  });
  it('milliseconds per day', () => {
    assert.equal(MILLISECONDS_PER_DAY, 86_400_000);
  });
  it('seconds per hour', () => {
    assert.equal(SECONDS_PER_HOUR, 3_600);
  });
  it('seconds per day', () => {
    assert.equal(SECONDS_PER_DAY, 86_400);
  });
  it('minutes per day', () => {
    assert.equal(MINUTES_PER_DAY, 1_440);
  });
});

describe('millisecondsToSeconds', () => {
  it('converts milliseconds to seconds', () => {
    assert.equal(millisecondsToSeconds(500), 0.5);
  });
});

describe('millisecondsToMinutes', () => {
  it('converts milliseconds to minutes', () => {
    assert.equal(millisecondsToMinutes(120_000), 2);
  });
});

describe('millisecondsToHours', () => {
  it('converts milliseconds to hours', () => {
    assert.equal(millisecondsToHours(7_200_000), 2);
  });
});

describe('millisecondsToDays', () => {
  it('converts milliseconds to days', () => {
    assert.equal(millisecondsToDays(172_800_000), 2);
  });
});

describe('secondsToMilliseconds', () => {
  it('converts seconds to milliseconds', () => {
    assert.equal(secondsToMilliseconds(1), 1_000);
  });
});

describe('secondsToMinutes', () => {
  it('converts seconds to minutes', () => {
    assert.equal(secondsToMinutes(120), 2);
  });
});

describe('secondsToHours', () => {
  it('converts seconds to hours', () => {
    assert.equal(secondsToHours(7_200), 2);
  });
});

describe('secondsToDays', () => {
  it('converts seconds to days', () => {
    assert.equal(secondsToDays(172_800), 2);
  });
});

describe('minutesToMilliseconds', () => {
  it('converts minutes to milliseconds', () => {
    assert.equal(minutesToMilliseconds(5), 300_000);
  });
});

describe('minutesToSeconds', () => {
  it('converts minutes to seconds', () => {
    assert.equal(minutesToSeconds(2), 120);
  });
});

describe('minutesToHours', () => {
  it('converts minutes to hours', () => {
    assert.equal(minutesToHours(90), 1.5);
  });
});

describe('minutesToDays', () => {
  it('converts minutes to days', () => {
    assert.equal(minutesToDays(1_440), 1);
  });
});

describe('hoursToMilliseconds', () => {
  it('converts hours to milliseconds', () => {
    assert.equal(hoursToMilliseconds(1), 3_600_000);
  });
});

describe('hoursToSeconds', () => {
  it('converts hours to seconds', () => {
    assert.equal(hoursToSeconds(1), 3_600);
  });
});

describe('hoursToMinutes', () => {
  it('converts hours to minutes', () => {
    assert.equal(hoursToMinutes(1.5), 90);
  });
});

describe('hoursToDays', () => {
  it('converts hours to days', () => {
    assert.equal(hoursToDays(48), 2);
  });
});

describe('daysToMilliseconds', () => {
  it('converts days to milliseconds', () => {
    assert.equal(daysToMilliseconds(1), 86_400_000);
  });
});

describe('daysToSeconds', () => {
  it('converts days to seconds', () => {
    assert.equal(daysToSeconds(1), 86_400);
  });
});

describe('daysToMinutes', () => {
  it('converts days to minutes', () => {
    assert.equal(daysToMinutes(1), 1_440);
  });
});

describe('daysToHours', () => {
  it('converts days to hours', () => {
    assert.equal(daysToHours(-2), -48);
  });
});

describe('round-trips', () => {
  it('milliseconds to seconds and back', () => {
    assert.equal(millisecondsToSeconds(secondsToMilliseconds(3)), 3);
  });
  it('milliseconds to minutes and back', () => {
    assert.equal(millisecondsToMinutes(minutesToMilliseconds(3)), 3);
  });
  it('milliseconds to hours and back', () => {
    assert.equal(millisecondsToHours(hoursToMilliseconds(3)), 3);
  });
  it('milliseconds to days and back', () => {
    assert.equal(millisecondsToDays(daysToMilliseconds(3)), 3);
  });
  it('seconds to minutes and back', () => {
    assert.equal(secondsToMinutes(minutesToSeconds(3)), 3);
  });
  it('seconds to hours and back', () => {
    assert.equal(secondsToHours(hoursToSeconds(3)), 3);
  });
  it('seconds to days and back', () => {
    assert.equal(secondsToDays(daysToSeconds(3)), 3);
  });
  it('minutes to hours and back', () => {
    assert.equal(minutesToHours(hoursToMinutes(3)), 3);
  });
  it('minutes to days and back', () => {
    assert.equal(minutesToDays(daysToMinutes(3)), 3);
  });
  it('hours to days and back', () => {
    assert.equal(hoursToDays(daysToHours(3)), 3);
  });
});

describe('fractional inputs', () => {
  it('preserves fractional minutes to seconds', () => {
    assert.equal(minutesToSeconds(1.5), 90);
  });
  it('preserves fractional seconds to minutes', () => {
    assert.equal(secondsToMinutes(30), 0.5);
  });
  it('preserves fractional milliseconds to seconds', () => {
    assert.equal(millisecondsToSeconds(1_500), 1.5);
  });
});

describe('zero', () => {
  it('converts zero seconds to milliseconds', () => {
    assert.equal(secondsToMilliseconds(0), 0);
  });
  it('converts zero days to hours', () => {
    assert.equal(daysToHours(0), 0);
  });
  it('converts zero milliseconds to days', () => {
    assert.equal(millisecondsToDays(0), 0);
  });
});

describe('negative values', () => {
  it('converts negative days to hours', () => {
    assert.equal(daysToHours(-2), -48);
  });
  it('converts negative seconds to minutes', () => {
    assert.equal(secondsToMinutes(-30), -0.5);
  });
});
