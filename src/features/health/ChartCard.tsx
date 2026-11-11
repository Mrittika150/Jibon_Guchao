import type { ReactNode } from "react";
import { formatShortDate } from "../../lib/dates";

type ChartCardProps = {
  title: string;
  subtitle: string;
  unit: string;
  rows: { date: string; value: number | null }[];
  children: ReactNode;
};

// A card with a chart, plus a "Show as table" view of the same numbers
export function ChartCard({ title, subtitle, unit, rows, children }: ChartCardProps) {
  const filled = rows.filter((row) => row.value !== null);

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-card p-4 shadow-sm">
      <div>
        <h3 className="text-base font-bold">{title}</h3>
        <p className="text-sm text-ink-soft">{subtitle}</p>
      </div>

      {filled.length === 0 ? (
        <p className="py-10 text-center text-ink-soft">Nothing logged in this period yet.</p>
      ) : (
        <figure aria-label={`${title} chart`} className="h-48 w-full">
          {children}
        </figure>
      )}

      {filled.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-ink-soft">Show as table</summary>
          <table className="mt-2 w-full">
            <thead>
              <tr className="text-left text-ink-soft">
                <th className="py-1 font-semibold">Date</th>
                <th className="py-1 text-right font-semibold">{unit}</th>
              </tr>
            </thead>
            <tbody>
              {filled.map((row) => (
                <tr key={row.date} className="border-t border-line">
                  <td className="py-1">{formatShortDate(row.date)}</td>
                  <td className="py-1 text-right">{row.value?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  );
}