import { describe, expect, it } from "vitest";
import { dueReminders, type ReminderInput } from "./reminders";

// A normal day; each test changes only what it needs
function day(changes: Partial<ReminderInput> = {}): ReminderInput {
  return {
    today: "2026-11-17",
    nowMinutes: 8 * 60, // 8:00 am, before work
    meals: [{ id: "lunch", meal_time: "13:30:00", name: "Lunch", food: "sample food" }],
    eatenMealIds: [],
    waterMl: 0,
    waterGoalMl: 2000,
    workStart: "09:00:00",
    workEnd: "17:00:00",
    deadlines: [],
    ...changes,
  };
}
const at = (hours: number, minutes = 0) => hours * 60 + minutes;
const ids = (input: ReminderInput, sent: string[] = []) => dueReminders(input, new Set(sent)).map((r) => r.id);

describe("meal reminders", () => {
  it("come at meal time", () => {
    expect(ids(day({ nowMinutes: at(13, 30) }))).toContain("meal-lunch-2026-11-17");
  });

  it("stop after 30 minutes, so opening the app late doesn't nag about old meals", () => {
    expect(ids(day({ nowMinutes: at(14, 0) }))).not.toContain("meal-lunch-2026-11-17");
  });

  it("skip meals you already ticked", () => {
    expect(ids(day({ nowMinutes: at(13, 35), eatenMealIds: ["lunch"] }))).not.toContain("meal-lunch-2026-11-17");
  });
});

describe("water reminders", () => {
  it("come once per 2-hour block of the work day", () => {
    expect(ids(day({ nowMinutes: at(9, 5) }))).toContain("water-2026-11-17-0");
    expect(ids(day({ nowMinutes: at(11, 0) }))).toContain("water-2026-11-17-1");
  });

  it("stay quiet outside work hours and once the goal is reached", () => {
    expect(ids(day({ nowMinutes: at(8, 0) })).some((id) => id.startsWith("water"))).toBe(false);
    expect(ids(day({ nowMinutes: at(18, 0) })).some((id) => id.startsWith("water"))).toBe(false);
    expect(ids(day({ nowMinutes: at(10, 0), waterMl: 2000 })).some((id) => id.startsWith("water"))).toBe(false);
  });
});

describe("deadline reminders", () => {
  const deadlines = [
    { id: "a", title: "Sample late", due_date: "2026-11-15", done: false },
    { id: "b", title: "Sample today", due_date: "2026-11-17", done: false },
    { id: "c", title: "Sample tomorrow", due_date: "2026-11-18", done: false },
    { id: "d", title: "Sample later", due_date: "2026-11-30", done: false },
    { id: "e", title: "Sample finished", due_date: "2026-11-17", done: true },
  ];

  it("send one summary from 9:00", () => {
    const reminders = dueReminders(day({ nowMinutes: at(9, 0), deadlines }), new Set());
    const summary = reminders.find((r) => r.id === "deadlines-2026-11-17");
    expect(summary?.body).toBe("Late: Sample late. Today: Sample today. Tomorrow: Sample tomorrow.");
  });

  it("wait until 9:00 and say nothing when nothing is close", () => {
    expect(ids(day({ nowMinutes: at(8, 59), deadlines }))).not.toContain("deadlines-2026-11-17");
    expect(ids(day({ nowMinutes: at(10, 0), deadlines: [deadlines[3]] }))).not.toContain("deadlines-2026-11-17");
  });
});

it("never repeats a reminder that was already shown", () => {
  const input = day({ nowMinutes: at(13, 30) }); // lunch time, in water block 2
  expect(ids(input)).toEqual(["meal-lunch-2026-11-17", "water-2026-11-17-2"]);
  expect(ids(input, ["meal-lunch-2026-11-17", "water-2026-11-17-2"])).toEqual([]);
});