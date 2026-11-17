import { describe, expect, it } from "vitest";
import { formatMealTime, minutesOf, nextMeal } from "./mealTime";

describe("minutesOf", () => {
  it("counts minutes after midnight", () => {
    expect(minutesOf("00:00:00")).toBe(0);
    expect(minutesOf("13:30:00")).toBe(810);
    expect(minutesOf("08:05")).toBe(485);
  });
});

describe("formatMealTime", () => {
  it("uses am and pm", () => {
    expect(formatMealTime("08:05:00")).toBe("8:05 am");
    expect(formatMealTime("13:30:00")).toBe("1:30 pm");
  });

  it("handles midnight and noon", () => {
    expect(formatMealTime("00:15:00")).toBe("12:15 am");
    expect(formatMealTime("12:00:00")).toBe("12:00 pm");
  });
});

describe("nextMeal", () => {
  const meals = [
    { name: "A", meal_time: "08:00:00" },
    { name: "B", meal_time: "13:30:00" },
    { name: "C", meal_time: "20:00:00" },
  ];

  it("finds the next meal still to come", () => {
    expect(nextMeal(meals, minutesOf("09:00"))?.name).toBe("B");
  });

  it("counts a meal happening right now as next", () => {
    expect(nextMeal(meals, minutesOf("13:30"))?.name).toBe("B");
  });

  it("gives null after the last meal", () => {
    expect(nextMeal(meals, minutesOf("21:00"))).toBeNull();
  });
});
