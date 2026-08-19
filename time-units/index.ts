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

export const millisecondsToSeconds = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_SECOND;

export const millisecondsToMinutes = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_MINUTE;

export const millisecondsToHours = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_HOUR;

export const millisecondsToDays = (milliseconds: number) =>
  milliseconds / MILLISECONDS_PER_DAY;

export const secondsToMilliseconds = (seconds: number) =>
  seconds * MILLISECONDS_PER_SECOND;

export const secondsToMinutes = (seconds: number) =>
  seconds / SECONDS_PER_MINUTE;

export const secondsToHours = (seconds: number) =>
  seconds / SECONDS_PER_HOUR;

export const secondsToDays = (seconds: number) =>
  seconds / SECONDS_PER_DAY;

export const minutesToMilliseconds = (minutes: number) =>
  minutes * MILLISECONDS_PER_MINUTE;

export const minutesToSeconds = (minutes: number) =>
  minutes * SECONDS_PER_MINUTE;

export const minutesToHours = (minutes: number) =>
  minutes / MINUTES_PER_HOUR;

export const minutesToDays = (minutes: number) =>
  minutes / MINUTES_PER_DAY;

export const hoursToMilliseconds = (hours: number) =>
  hours * MILLISECONDS_PER_HOUR;

export const hoursToSeconds = (hours: number) =>
  hours * SECONDS_PER_HOUR;

export const hoursToMinutes = (hours: number) =>
  hours * MINUTES_PER_HOUR;

export const hoursToDays = (hours: number) =>
  hours / HOURS_PER_DAY;

export const daysToMilliseconds = (days: number) =>
  days * MILLISECONDS_PER_DAY;

export const daysToSeconds = (days: number) =>
  days * SECONDS_PER_DAY;

export const daysToMinutes = (days: number) =>
  days * MINUTES_PER_DAY;

export const daysToHours = (days: number) =>
  days * HOURS_PER_DAY;
