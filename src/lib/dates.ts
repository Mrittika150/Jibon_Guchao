// Dates are saved as "YYYY-MM-DD" text, using YOUR computer's local day.
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

// Turns "2026-11-11" back into a Date at local midnight
export function fromISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLongDate(isoDate: string): string {
  return fromISODate(isoDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(isoDate: string): string {
  return fromISODate(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function weekdayOf(isoDate: string): number {
  return fromISODate(isoDate).getDay(); // 0 = Sunday ... 6 = Saturday
}

export function addDays(isoDate: string, days: number): string {
  const date = fromISODate(isoDate);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

// All the dates to show for one month, in full weeks from Sunday to Saturday.
// month is 0-11, like JavaScript's getMonth().
export function monthGrid(year: number, month: number): string[] {
  const first = toISODate(new Date(year, month, 1));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanksBefore = weekdayOf(first);
  const totalCells = Math.ceil((blanksBefore + daysInMonth) / 7) * 7;

  const start = addDays(first, -blanksBefore);
  return Array.from({ length: totalCells }, (_, i) => addDays(start, i));
}

export function formatMonth(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}