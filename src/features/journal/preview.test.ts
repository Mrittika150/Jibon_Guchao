import { describe, expect, it } from "vitest";
import { htmlToText, previewOf, toEditorHtml } from "./preview";

describe("htmlToText", () => {
  it("turns paragraphs and headings into lines", () => {
    expect(htmlToText("<h3>Hi</h3><p>A <strong>good</strong> day</p>")).toBe("Hi\nA good day\n");
  });

  it("decodes special characters once", () => {
    expect(htmlToText("<p>Tom &amp; Jerry &lt;3 &amp;lt;</p>")).toBe("Tom & Jerry <3 &lt;\n");
  });

  it("leaves old plain-text entries alone", () => {
    expect(htmlToText("Just text\nTwo lines")).toBe("Just text\nTwo lines");
  });
});

describe("toEditorHtml", () => {
  it("turns each old line into a paragraph", () => {
    expect(toEditorHtml("Line one\nLine two")).toBe("<p>Line one</p><p>Line two</p>");
  });

  it("escapes characters that mean something in HTML", () => {
    expect(toEditorHtml("a < b & <script>")).toBe("<p>a &lt; b &amp; &lt;script&gt;</p>");
  });

  it("keeps HTML entries and empty entries as they are", () => {
    expect(toEditorHtml("<p>Hi</p>")).toBe("<p>Hi</p>");
    expect(toEditorHtml("")).toBe("");
  });
});

describe("previewOf", () => {
  it("keeps a short first line as it is", () => {
    expect(previewOf("A calm day.\nMore details here.")).toBe("A calm day.");
  });

  it("reads formatted entries", () => {
    expect(previewOf("<h3>What made you smile?</h3><p>The rain.</p>")).toBe("What made you smile?");
  });

  it("skips empty lines at the start", () => {
    expect(previewOf("\n\n   \nFirst real line")).toBe("First real line");
    expect(previewOf("<p></p><p>   </p><p>First real line</p>")).toBe("First real line");
  });

  it("shortens long lines at a space, with ...", () => {
    const long = "Today I walked to the market and then I studied for a very long time";
    expect(previewOf(long, 30)).toBe("Today I walked to the market...");
  });

  it("cuts mid-word only when there is no space to cut at", () => {
    expect(previewOf("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdefghij...");
  });

  it("gives an empty string for an empty entry", () => {
    expect(previewOf("   \n  ")).toBe("");
    expect(previewOf("<p></p>")).toBe("");
  });
});
