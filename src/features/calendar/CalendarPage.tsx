import { useState } from "react";
import { formatLongDate, formatMonth, monthGrid, toISODate, todayISO, weekdayOf } from "../../lib/dates";
import { groupByDate, useRangeData } from "../../lib/rangeData";
import { useSettings } from "../today/api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarPageProps = {
  onOpenDay: (date: string) => void;
};

export function CalendarPage({ onOpenDay }: CalendarPageProps) {
  const today = todayISO();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [selected, setSelected] = useState(today);

  const days = monthGrid(year, month);
  const range = useRangeData(days[0], days[days.length - 1]);
  const settings = useSettings();

  const logsByDate = groupByDate(range.data?.logs ?? [], (log) => log.log_date);
  const exercisesByDate = groupByDate(range.data?.exerciseLogs ?? [], (log) => log.log_date);
  const todosByDate = groupByDate(range.data?.todos ?? [], (todo) => todo.due_date);
  const stepGoal = settings.data?.step_goal ?? 10000;
  const daysOff = settings.data?.days_off ?? [];

  function showMonth(next: Date) {
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function changeMonth(by: number) {
    const next = new Date(year, month + by, 1);
    showMonth(next);
    // Select the 1st of the new month, so the side panel shows a day you can see
    setSelected(toISODate(next));
  }

  function goToToday() {
    showMonth(new Date());
    setSelected(today);
  }

  // What happened on the selected day, for the side panel
  const selectedLog = logsByDate.get(selected)?.[0];
  const selectedTodos = todosByDate.get(selected) ?? [];
  const selectedExercises = exercisesByDate.get(selected)?.length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => changeMonth(-1)} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Previous
        </button>
        <h3 className="min-w-44 text-center text-lg font-bold" aria-live="polite">
          {formatMonth(year, month)}
        </h3>
        <button type="button" onClick={() => changeMonth(1)} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Next
        </button>
        <button type="button" onClick={goToToday} className="ml-auto rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink">
          Today
        </button>
      </div>

      {range.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not load this month: {range.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="rounded-3xl border border-line bg-card p-3 shadow-sm">
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((name) => (
              <div key={name} className="px-1.5 pb-1 text-xs font-semibold text-ink-soft">
                {name}
              </div>
            ))}

            {days.map((date) => {
              const inMonth = Number(date.slice(5, 7)) === month + 1;
              const log = logsByDate.get(date)?.[0];
              const metStepGoal = (log?.steps ?? 0) >= stepGoal;
              const isDayOff = daysOff.includes(weekdayOf(date));
              const isSelected = date === selected;
              const isToday = date === today;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelected(date)}
                  onDoubleClick={() => onOpenDay(date)}
                  aria-pressed={isSelected}
                  aria-label={formatLongDate(date)}
                  className={`flex h-16 flex-col items-start gap-0.5 rounded-xl border p-1.5 text-left text-xs transition-colors ${
                    isSelected ? "border-pink bg-card-soft" : "border-transparent hover:bg-card-soft"
                  } ${isDayOff && !isSelected ? "bg-page" : ""} ${inMonth ? "" : "opacity-40"}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${
                      isToday ? "bg-pink text-on-pink" : ""
                    }`}
                  >
                    {Number(date.slice(8, 10))}
                  </span>
                  {log?.steps != null && (
                    <span className={metStepGoal ? "font-bold" : "text-ink-soft"}>
                      {(log.steps / 1000).toFixed(1)}k
                    </span>
                  )}
                  {log?.is_fast_day && <span className="h-1.5 w-6 rounded-full bg-pink" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 px-1.5 text-xs text-ink-soft">
            Steps in thousands, bold = goal reached. Pink line = fast day. Shaded = day off.
          </p>
        </div>

        <aside className="flex flex-col gap-3 rounded-3xl border border-line bg-card p-4 shadow-sm">
          <h3 className="font-bold">{formatLongDate(selected)}</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-ink-soft">Steps</dt>
            <dd className="text-right font-semibold">{selectedLog?.steps?.toLocaleString() ?? "-"}</dd>
            <dt className="text-ink-soft">Water</dt>
            <dd className="text-right font-semibold">{selectedLog?.water_ml != null ? `${selectedLog.water_ml} ml` : "-"}</dd>
            <dt className="text-ink-soft">Walk</dt>
            <dd className="text-right font-semibold">{selectedLog?.walk_minutes != null ? `${selectedLog.walk_minutes} min` : "-"}</dd>
            <dt className="text-ink-soft">Weight</dt>
            <dd className="text-right font-semibold">{selectedLog?.weight_kg != null ? `${selectedLog.weight_kg} kg` : "-"}</dd>
            <dt className="text-ink-soft">Exercises</dt>
            <dd className="text-right font-semibold">{selectedExercises} done</dd>
            <dt className="text-ink-soft">To-dos</dt>
            <dd className="text-right font-semibold">
              {selectedTodos.filter((todo) => todo.done).length} / {selectedTodos.length}
            </dd>
            <dt className="text-ink-soft">Fast day</dt>
            <dd className="text-right font-semibold">{selectedLog?.is_fast_day ? "Yes" : "No"}</dd>
          </dl>
          <button
            type="button"
            onClick={() => onOpenDay(selected)}
            className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink"
          >
            Open this day
          </button>
        </aside>
      </div>
    </div>
  );
}
