// Turns a list of rows into CSV text that Excel and Google Sheets can open.
export function toCsv<T extends Record<string, unknown>>(rows: T[], columns: (keyof T & string)[]): string {
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((column) => csvCell(row[column])).join(","));
  return [header, ...lines].join("\r\n");
}


export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = String(value);

  
  if (typeof value === "string" && /^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  
  if (/[",\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}