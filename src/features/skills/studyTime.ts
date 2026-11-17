import { addDays, fromISODate, weekdayOf } from "../../lib/dates";

// 45 -> "45 min", 60 -> "1 h", 135 -> "2 h 15 min"
export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

// The week (Sunday to Saturday, like the Calendar) that a date is in
export function weekOf(date: string): { from: string; to: string } {
  const from = addDays(date, -weekdayOf(date));
  return { from, to: addDays(from, 6) };
}

// How many days in a row you practised, counting back from today.
// If you haven't practised YET today, the streak from yesterday still counts.
export function practiceStreak(practisedDates: Set<string>, today: string): number {
  let day = practisedDates.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (practisedDates.has(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

// Whole days from today until the due date (negative = late)
export function daysUntil(due: string, today: string): number {
  const ms = fromISODate(due).getTime() - fromISODate(today).getTime();
  return Math.round(ms / 86_400_000); // round, so clock changes can't give 2.96 days
}

// "Due today", "Tomorrow", "In 5 days", "1 day late", "3 days late"
export function dueLabel(due: string, today: string): string {
  const days = daysUntil(due, today);
  if (days === 0) return "Due today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  return days === -1 ? "1 day late" : `${-days} days late`;
}
