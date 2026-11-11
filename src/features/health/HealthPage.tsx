import { useState } from "react";
import { addDays, todayISO } from "../../lib/dates";
import { useRangeData } from "../../lib/rangeData";
import { useSettings } from "../today/api";
import { ChartCard } from "./ChartCard";
import { StatTile } from "./StatTile";
import { StepsChart, WeightChart, type ChartRow } from "./charts";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

export function HealthPage() {
  const [days, setDays] = useState<Period>(30);
  const to = todayISO();
  const from = addDays(to, -(days - 1));

  const range = useRangeData(from, to);
  const settings = useSettings();
  const stepGoal = settings.data?.step_goal ?? 10000;

  // One row for EVERY day in the period, even days with nothing logged
  const allDates = Array.from({ length: days }, (_, i) => addDays(from, i));
  const logByDate = new Map((range.data?.logs ?? []).map((log) => [log.log_date, log]));
  const stepRows: ChartRow[] = allDates.map((date) => ({ date, value: logByDate.get(date)?.steps ?? null }));
  const weightRows: ChartRow[] = allDates.map((date) => ({ date, value: logByDate.get(date)?.weight_kg ?? null }));

  // Numbers for the stat tiles
  const loggedSteps = stepRows.flatMap((row) => (row.value === null ? [] : [row.value]));
  const averageSteps = loggedSteps.length
    ? Math.round(loggedSteps.reduce((sum, steps) => sum + steps, 0) / loggedSteps.length)
    : null;
  const goalDays = loggedSteps.filter((steps) => steps >= stepGoal).length;
  const weights = weightRows.flatMap((row) => (row.value === null ? [] : [row.value]));
  const weightChange = weights.length >= 2 ? weights[weights.length - 1] - weights[0] : null;
  const exerciseDays = new Set((range.data?.exerciseLogs ?? []).map((log) => log.log_date)).size;

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Time period" className="flex gap-2">
        {PERIODS.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => setDays(period)}
            aria-pressed={days === period}
            className={`rounded-2xl px-4 py-2 font-semibold ${
              days === period ? "bg-pink text-on-pink" : "bg-card hover:bg-card-soft"
            }`}
          >
            {period} days
          </button>
        ))}
      </div>

      {range.isPending && <p className="text-ink-soft">Loading...</p>}
      {range.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not load your history: {range.error.message}
        </p>
      )}

      {range.isSuccess && (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatTile label="Average steps" value={averageSteps?.toLocaleString() ?? "-"} detail={`on ${loggedSteps.length} logged days`} />
            <StatTile label="Step goal reached" value={`${goalDays} days`} detail={`goal: ${stepGoal.toLocaleString()}`} />
            <StatTile
              label="Weight change"
              value={weightChange === null ? "-" : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg`}
              detail="first to last weigh-in"
            />
            <StatTile label="Exercise days" value={`${exerciseDays} / ${days}`} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ChartCard title="Steps" subtitle={`Daily steps, last ${days} days`} unit="steps" rows={stepRows}>
              <StepsChart rows={stepRows} goal={stepGoal} />
            </ChartCard>
            <ChartCard title="Weight" subtitle={`kg, last ${days} days`} unit="kg" rows={weightRows}>
              <WeightChart rows={weightRows} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}