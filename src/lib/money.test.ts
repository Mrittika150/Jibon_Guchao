import { describe, expect, it } from "vitest";
import { formatTaka, parseTaka } from "./money";

describe("parseTaka", () => {
  it("reads whole taka", () => {
    expect(parseTaka("120")).toBe(12000);
  });

  it("reads taka and paisa", () => {
    expect(parseTaka("120.5")).toBe(12050);
    expect(parseTaka("120.05")).toBe(12005);
    expect(parseTaka("0.10")).toBe(10);
  });

  it("ignores commas, spaces and the taka sign", () => {
    expect(parseTaka(" 1,250.50 ")).toBe(125050);
    expect(parseTaka("৳500")).toBe(50000);
  });

  it("adds up exactly, unlike decimals", () => {
    expect((parseTaka("0.1") ?? 0) + (parseTaka("0.2") ?? 0)).toBe(parseTaka("0.3"));
  });

  it("refuses anything that is not a positive amount", () => {
    for (const bad of ["", "0", "0.00", "-5", "abc", "1.234", "1.2.3", "1e5", "Infinity"]) {
      expect(parseTaka(bad)).toBeNull();
    }
  });

  it("refuses amounts above the database limit", () => {
    expect(parseTaka("1000000000")).toBe(100_000_000_000);
    expect(parseTaka("1000000000.01")).toBeNull();
  });
});

describe("formatTaka", () => {
  it("hides .00 for whole taka", () => {
    expect(formatTaka(120000)).toBe("৳1,200");
  });

  it("shows paisa when there are some", () => {
    expect(formatTaka(125050)).toBe("৳1,250.50");
  });

  it("groups in lakhs, the Bangladeshi way", () => {
    expect(formatTaka(12000000)).toBe("৳1,20,000");
  });
});