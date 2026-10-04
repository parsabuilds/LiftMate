import { getLocalDateString } from './date';

function previousDay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return getLocalDateString(new Date(y, m - 1, d - 1));
}

// Consecutive days with a workout. The current streak stays alive through
// today until the day is over, so it doesn't drop to 0 each morning.
export function computeStreaks(workoutDates: Iterable<string>, today: string): { current: number; longest: number } {
  const days = new Set(workoutDates);

  let current = 0;
  let day = days.has(today) ? today : previousDay(today);
  while (days.has(day)) {
    current += 1;
    day = previousDay(day);
  }

  let longest = 0;
  for (const start of days) {
    // Only count runs from their last day backwards
    const [y, m, d] = start.split('-').map(Number);
    if (days.has(getLocalDateString(new Date(y, m - 1, d + 1)))) continue;
    let length = 0;
    let cursor = start;
    while (days.has(cursor)) {
      length += 1;
      cursor = previousDay(cursor);
    }
    longest = Math.max(longest, length);
  }

  return { current, longest };
}
