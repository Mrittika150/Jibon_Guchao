const MAX_PAISA = 100_000_000_000;
export function parseTaka(text: string): number | null {
  const cleaned = text.trim().replace(/^৳/, "").replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;

  const [whole, fraction = ""] = cleaned.split(".");
  const paisa = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (paisa <= 0 || paisa > MAX_PAISA) return null;
  return paisa;
}

export function formatTaka(paisa: number): string {
  const hasPaisa = paisa % 100 !== 0;
  const taka = (paisa / 100).toLocaleString("en-IN", {
    minimumFractionDigits: hasPaisa ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `৳${taka}`;
}