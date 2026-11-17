import { describe, expect, it } from "vitest";
import { daysUntil, dueLabel, formatMinutes, practiceStreak, weekOf } from "./studyTime";

describe("formatMinutes", () => {
  it("shows minutes, hours, or both", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(135)).toBe("2 h 15 min");
    expect(formatMinutes(0)).toBe("0 min");
  });
});

describe("weekOf", () => {
  it("runs Sunday to Saturday", () => {
    // 17 November 2026 is a Tuesday
    expect(weekOf("2026-11-17")).toEqual({ from: "2026-11-15", to: "2026-11-21" });
  });

  it("works across a month and year end", () => {
    // 1 January 2027 is a Friday
    expect(weekOf("2027-01-01")).toEqual({ from: "2026-12-27", to: "2027-01-02" });
  });
});

describe("practiceStreak", () => {
  const days = new Set(["2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17"]);

  it("counts days in a row up to today", () => {
    expect(practiceStreak(days, "2026-11-17")).toBe(4);
  });

  it("still counts yesterday's streak if today isn't done yet", () => {
    expect(practiceStreak(days, "2026-11-18")).toBe(4);
  });

  it("is 0 after a missed day", () => {
    expect(practiceStreak(days, "2026-11-19")).toBe(0);
  });
});

describe("dueLabel", () => {
  it("talks like a person", () => {
    expect(dueLabel("2026-11-17", "2026-11-17")).toBe("Due today");
    expect(dueLabel("2026-11-18", "2026-11-17")).toBe("Tomorrow");
    expect(dueLabel("2026-11-22", "2026-11-17")).toBe("In 5 days");
    expect(dueLabel("2026-11-16", "2026-11-17")).toBe("1 day late");
    expect(dueLabel("2026-11-14", "2026-11-17")).toBe("3 days late");
  });

  it("counts across months", () => {
    expect(daysUntil("2026-12-01", "2026-11-17")).toBe(14);
  });
});
