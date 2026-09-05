import {
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_DAY,
  daysToMilliseconds,
  hoursToMilliseconds,
  minutesToMilliseconds,
  secondsToMilliseconds,
  millisecondsToSeconds,
  millisecondsToMinutes,
  millisecondsToHours,
  millisecondsToDays,
} from 'z-time-units';

/** Requires at least one property of `T` to be present. */
type RequireAtLeastOne<T> = {
  [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

export type Duration = RequireAtLeastOne<{
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}>;

export const durationToMilliseconds = (duration: Duration): number =>
  daysToMilliseconds(duration.days ?? 0) +
  hoursToMilliseconds(duration.hours ?? 0) +
  minutesToMilliseconds(duration.minutes ?? 0) +
  secondsToMilliseconds(duration.seconds ?? 0) +
  (duration.milliseconds ?? 0);

export const durationToSeconds = (duration: Duration): number =>
  millisecondsToSeconds(durationToMilliseconds(duration));

export const durationToMinutes = (duration: Duration): number =>
  millisecondsToMinutes(durationToMilliseconds(duration));

export const durationToHours = (duration: Duration): number =>
  millisecondsToHours(durationToMilliseconds(duration));

export const durationToDays = (duration: Duration): number =>
  millisecondsToDays(durationToMilliseconds(duration));

export const millisecondsToDuration = (milliseconds: number): Duration => {
  const result: Partial<Duration> = {};
  let remaining = milliseconds;

  const days = Math.trunc(remaining / MILLISECONDS_PER_DAY);
  if (days !== 0) {
    result.days = days;
    remaining -= days * MILLISECONDS_PER_DAY;
  }

  const hours = Math.trunc(remaining / MILLISECONDS_PER_HOUR);
  if (hours !== 0) {
    result.hours = hours;
    remaining -= hours * MILLISECONDS_PER_HOUR;
  }

  const minutes = Math.trunc(remaining / MILLISECONDS_PER_MINUTE);
  if (minutes !== 0) {
    result.minutes = minutes;
    remaining -= minutes * MILLISECONDS_PER_MINUTE;
  }

  const seconds = Math.trunc(remaining / MILLISECONDS_PER_SECOND);
  if (seconds !== 0) {
    result.seconds = seconds;
    remaining -= seconds * MILLISECONDS_PER_SECOND;
  }

  // `remaining` may be a legitimate 0, or -0 from truncating a negative
  // fraction; `|| 0` collapses -0 to 0 without disturbing any other value.
  // At least one field is required, so an all-zero result still reports
  // `{ milliseconds: 0 }` rather than an empty object.
  if (remaining !== 0 || Object.keys(result).length === 0) {
    result.milliseconds = remaining || 0;
  }

  return result as Duration;
};

export const secondsToDuration = (seconds: number): Duration =>
  millisecondsToDuration(secondsToMilliseconds(seconds));

export const minutesToDuration = (minutes: number): Duration =>
  millisecondsToDuration(minutesToMilliseconds(minutes));

export const hoursToDuration = (hours: number): Duration =>
  millisecondsToDuration(hoursToMilliseconds(hours));

export const daysToDuration = (days: number): Duration =>
  millisecondsToDuration(daysToMilliseconds(days));

export const balanceDuration = (duration: Duration): Duration =>
  millisecondsToDuration(durationToMilliseconds(duration));
