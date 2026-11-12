import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./csv";

describe("csvCell", () => {
  it("leaves plain values alone", () => {
    expect(csvCell("walk")).toBe("walk");
    expect(csvCell(8406)).toBe("8406");
    expect(csvCell(-1.5)).toBe("-1.5");
  });

  it("turns empty values into empty cells", () => {
    expect(csvCell(null)).toBe("");
    expect(csvCell(undefined)).toBe("");
  });

  it("quotes commas, quotes and line breaks", () => {
    expect(csvCell("tired, but walked")).toBe('"tired, but walked"');
    expect(csvCell('said "hi"')).toBe('"said ""hi"""');
    expect(csvCell("line 1\nline 2")).toBe('"line 1\nline 2"');
  });

  it("stops text from running as an Excel formula", () => {
    expect(csvCell("=1+1")).toBe("'=1+1");
    expect(csvCell("@sum")).toBe("'@sum");
  });
});

describe("toCsv", () => {
  it("writes a header and one line per row", () => {
    const rows = [
      { date: "2026-11-01", steps: 8000 },
      { date: "2026-11-02", steps: null },
    ];
    expect(toCsv(rows, ["date", "steps"])).toBe("date,steps\r\n2026-11-01,8000\r\n2026-11-02,");
  });
});