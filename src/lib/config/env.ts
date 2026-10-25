// AICTE Sentinel Environment & Static Reference Configuration
// Anchors statutory reference dates and simulated environment parameters

/**
 * Scrutiny reference date anchor (defaults to seed reference date 2026-02-01).
 * Ensures deterministic evaluation across all historical and current approval test runs.
 */
export const DEFAULT_AS_OF_DATE = '2026-02-01T00:00:00.000Z';

export function getAsOfDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_AS_OF_DATE;
  if (envDate) {
    const parsed = new Date(envDate);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date(DEFAULT_AS_OF_DATE);
}

export function formatAsOfDateString(): string {
  return '01 Feb 2026';
}
