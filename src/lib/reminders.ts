import { addDays } from "./dates";

// Everything the reminder rules need to know, gathered by useReminders()
export type ReminderInput = {
  today: string; // "2026-11-17"
  nowMinutes: number; // minutes after midnight, e.g. 13:30 -> 810
  meals: { id: string; meal_time: string; name: string; food: string }[];
  eatenMealIds: string[];
  waterMl: number;
  waterGoalMl: number;
  workStart: string; // "09:00:00"
  workEnd: string; // "17:00:00"
  deadlines: { id: string; title: string; due_date: string; done: boolean }[];
};

export type Reminder = { id: string; title: string; body: string };

const MEAL_WINDOW = 30; // remind during the first 30 minutes after a meal's time
const WATER_EVERY = 120; // a water reminder every 2 hours of the work day
const DEADLINES_AT = 9 * 60; // the deadline summary comes at 9:00 am

function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Which reminders should go out right now? `sent` holds the ids already shown today,
// so each reminder appears only once, however often this runs.
export function dueReminders(input: ReminderInput, sent: Set<string>): Reminder[] {
  const reminders: Reminder[] = [];
  const now = input.nowMinutes;

  // 1. Meals: at meal time, if you haven't ticked it yet
  for (const meal of input.meals) {
    const start = minutesOf(meal.meal_time);
    const isMealTime = now >= start && now < start + MEAL_WINDOW;
    if (isMealTime && !input.eatenMealIds.includes(meal.id)) {
      reminders.push({
        id: `meal-${meal.id}-${input.today}`,
        title: `Time for ${meal.name}`,
        body: meal.food || "Your planned meal is now.",
      });
    }
  }

  // 2. Water: once in each 2-hour block of the work day, until you reach your goal
  const workStart = minutesOf(input.workStart);
  const workEnd = minutesOf(input.workEnd);
  if (now >= workStart && now < workEnd && input.waterMl < input.waterGoalMl) {
    const block = Math.floor((now - workStart) / WATER_EVERY);
    reminders.push({
      id: `water-${input.today}-${block}`,
      title: "Time for some water",
      body: `${input.waterMl} of ${input.waterGoalMl} ml so far today.`,
    });
  }

  // 3. Deadlines: one summary a day from 9:00, for anything late, due today or tomorrow
  if (now >= DEADLINES_AT) {
    const tomorrow = addDays(input.today, 1);
    const open = input.deadlines.filter((deadline) => !deadline.done);
    const late = open.filter((deadline) => deadline.due_date < input.today);
    const dueToday = open.filter((deadline) => deadline.due_date === input.today);
    const dueTomorrow = open.filter((deadline) => deadline.due_date === tomorrow);

    const parts = [
      late.length > 0 && `Late: ${late.map((deadline) => deadline.title).join(", ")}.`,
      dueToday.length > 0 && `Today: ${dueToday.map((deadline) => deadline.title).join(", ")}.`,
      dueTomorrow.length > 0 && `Tomorrow: ${dueTomorrow.map((deadline) => deadline.title).join(", ")}.`,
    ].filter((part): part is string => typeof part === "string");

    if (parts.length > 0) {
      reminders.push({ id: `deadlines-${input.today}`, title: "Deadlines", body: parts.join(" ") });
    }
  }

  return reminders.filter((reminder) => !sent.has(reminder.id));
}