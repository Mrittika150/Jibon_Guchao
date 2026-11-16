// The database sends times as "13:30:00". These helpers turn them into something friendly.

// "13:30:00" -> 810 (minutes after midnight), so times are easy to compare
export function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// "13:30:00" -> "1:30 pm", "08:05" -> "8:05 am", "00:15" -> "12:15 am"
export function formatMealTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "am" : "pm";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

// The first meal that is still coming up (meals must be sorted by time)
export function nextMeal<T extends { meal_time: string }>(meals: T[], nowMinutes: number): T | null {
  return meals.find((meal) => minutesOf(meal.meal_time) >= nowMinutes) ?? null;
}
