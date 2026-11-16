// Journal entries are saved as HTML (from the editor). Older entries are plain text.

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function isHtml(body: string): boolean {
  return body.trimStart().startsWith("<");
}

// "<h3>Hi</h3><p>A <strong>good</strong> day</p>" -> "Hi\nA good day"
export function htmlToText(body: string): string {
  if (!isHtml(body)) return body;
  return body
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity]);
}

// Old plain-text entries become paragraphs, so the editor keeps their line breaks
export function toEditorHtml(body: string): string {
  if (body === "" || isHtml(body)) return body;
  const escape = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return body
    .split("\n")
    .map((line) => `<p>${escape(line)}</p>`)
    .join("");
}

// The first line you wrote, shortened for the month list: "Went to the park with..."
export function previewOf(body: string, maxLength = 60): string {
  const firstLine =
    htmlToText(body)
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line !== "") ?? "";
  if (firstLine.length <= maxLength) return firstLine;

  const cut = firstLine.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  // Cut at a space if there is one near the end, so words aren't chopped in half
  return (lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "...";
}
