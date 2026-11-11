import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatShortDate } from "../../lib/dates";

export type ChartRow = { date: string; value: number | null };

// Colours come from the theme, so charts switch with pink/dark mode
const AXIS_TICK = { fill: "var(--ink-soft)", fontSize: 12 };

type TipProps = {
  active?: boolean;
  payload?: { payload: ChartRow }[];
  unit: string;
};

function ChartTooltip({ active, payload, unit }: TipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row || row.value === null) return null;
  return (
    <div className="rounded-2xl border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-soft">{formatShortDate(row.date)}</p>
      <p className="font-bold">
        {row.value.toLocaleString()} {unit}
      </p>
    </div>
  );
}

export function StepsChart({ rows, goal }: { rows: ChartRow[]; goal: number }) {
  // Round axis numbers: 0, 5K, 10K, 15K...
  const highest = Math.max(goal, ...rows.map((row) => row.value ?? 0));
  const top = Math.ceil(highest / 5000) * 5000;
  const ticks = Array.from({ length: top / 5000 + 1 }, (_, i) => i * 5000);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 16, right: 48, bottom: 0, left: 0 }} barCategoryGap="20%">
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--line)" }} minTickGap={24} />
        <YAxis domain={[0, top]} ticks={ticks} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}K`)} />
        <Tooltip content={<ChartTooltip unit="steps" />} cursor={{ fill: "var(--card-soft)" }} />
        <ReferenceLine y={goal} stroke="var(--ink-soft)" label={{ value: "Goal", position: "right", fill: "var(--ink-soft)", fontSize: 12 }} />
        <Bar dataKey="value" fill="var(--chart)" radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeightChart({ rows }: { rows: ChartRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--line)" }} minTickGap={24} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} domain={["dataMin - 1", "dataMax + 1"]} allowDecimals={false} />
        <Tooltip content={<ChartTooltip unit="kg" />} cursor={{ stroke: "var(--ink-soft)", strokeWidth: 1 }} />
        <Line
          dataKey="value"
          type="linear"
          stroke="var(--chart)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          connectNulls
          dot={{ r: 4, fill: "var(--chart)", stroke: "var(--card)", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "var(--chart)", stroke: "var(--card)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}