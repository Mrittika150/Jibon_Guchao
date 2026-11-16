import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sticker } from "../../components/stickers/Sticker";
import { formatTaka } from "../../lib/money";

export type CategoryTotal = { label: string; paisa: number };

const AXIS_TICK = { fill: "var(--ink-soft)", fontSize: 12 };

type TipProps = { active?: boolean; payload?: { payload: CategoryTotal }[] };

function CategoryTooltip({ active, payload }: TipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded-2xl border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-soft">{row.label}</p>
      <p className="font-bold">{formatTaka(row.paisa)}</p>
    </div>
  );
}

// Biggest spending first, one bar per category
export function CategoryChart({ totals }: { totals: CategoryTotal[] }) {
  return (
    <section className="pop-in relative flex flex-col gap-3 rounded-3xl border border-line bg-card p-4 shadow-sm">
      <Sticker name="star" className="sticker-wiggle absolute -top-5 -right-3 h-14 w-14 rotate-12" />
      <div>
        <h3 className="text-base font-bold">By category</h3>
        <p className="text-sm text-ink-soft">Where this month's money went</p>
      </div>

      {totals.length === 0 ? (
        <p className="py-10 text-center text-ink-soft">Nothing spent this month yet.</p>
      ) : (
        <>
          <figure aria-label="Spending by category chart" className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totals} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap="20%">
                <CartesianGrid horizontal={false} stroke="var(--line)" />
                <XAxis
                  type="number"
                  dataKey="paisa"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  tickCount={4}
                  allowDecimals={false}
                  tickFormatter={(paisa: number) => formatTaka(Math.round(paisa / 100) * 100)}
                />
                <YAxis type="category" dataKey="label" interval={0} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--line)" }} width={76} />
                <Tooltip content={<CategoryTooltip />} cursor={{ fill: "var(--card-soft)" }} />
                <Bar dataKey="paisa" fill="var(--chart)" radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </figure>

          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-ink-soft">Show as table</summary>
            <table className="mt-2 w-full">
              <thead>
                <tr className="text-left text-ink-soft">
                  <th className="py-1 font-semibold">Category</th>
                  <th className="py-1 text-right font-semibold">Spent</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <td className="py-1">{row.label}</td>
                    <td className="py-1 text-right">{formatTaka(row.paisa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </section>
  );
}