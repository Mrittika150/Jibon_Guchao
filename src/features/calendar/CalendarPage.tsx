import { useState } from "react";
import { formatMonth, monthGrid, todayISO, weekdayOf } from "../../lib/dates";
import { groupByDate, useRangeData } from "../../lib/rangeData";
import { useSettings } from "../today/api";
import { TodayPage } from "../today/TodayPage";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
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

  function changeMonth(by: number) {
    const next = new Date(year, month + by, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function goToToday() {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(today);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => changeMonth(-1)} className="rounded-2xl bg-card px-4 py-2 font-semibold hover:bg-card-soft">
          Previous
        </button>
        <h3 className="min-w-48 text-center text-xl font-bold" aria-live="polite">
          {formatMonth(year, month)}
        </h3>
        <button type="button" onClick={() => changeMonth(1)} className="rounded-2xl bg-card px-4 py-2 font-semibold hover:bg-card-soft">
          Next
        </button>
        <button type="button" onClick={goToToday} className="ml-auto rounded-2xl bg-pink px-4 py-2 font-bold text-on-pink">
          Today
        </button>
      </div>

      {range.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not load this month: {range.error.message}
        </p>
      )}

      <div className="rounded-3xl border border-line bg-card p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((name) => (
            <div key={name} className="px-2 pb-2 text-sm font-semibold text-ink-soft">
              {name}
            </div>
          ))}

          {days.map((date) => {
            const inMonth = Number(date.slice(5, 7)) === month + 1;
            const log = logsByDate.get(date)?.[0];
            const exercisesDone = exercisesByDate.get(date)?.length ?? 0;
            const todos = todosByDate.get(date) ?? [];
            const todosDone = todos.filter((todo) => todo.done).length;
            const metStepGoal = (log?.steps ?? 0) >= stepGoal;
            const isDayOff = daysOff.includes(weekdayOf(date));
            const isSelected = date === selected;
            const isToday = date === today;

            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelected(date)}
                aria-pressed={isSelected}
                aria-label={date}
                className={`flex min-h-24 flex-col items-start gap-1 rounded-2xl border p-2 text-left text-xs transition-colors ${
                  isSelected ? "border-pink bg-card-soft" : "border-transparent hover:bg-card-soft"
                } ${isDayOff && !isSelected ? "bg-page" : ""} ${inMonth ? "" : "opacity-40"}`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                    isToday ? "bg-pink text-on-pink" : ""
                  }`}
                >
                  {Number(date.slice(8, 10))}
                </span>
                {log?.steps != null && (
                  <span className={metStepGoal ? "font-bold" : "text-ink-soft"}>
                    {(log.steps / 1000).toFixed(1)}k steps
                  </span>
                )}
                {exercisesDone > 0 && <span className="text-ink-soft">{exercisesDone} {exercisesDone === 1 ? "exercise" : "exercises"}</span>}
                {todos.length > 0 && (
                  <span className="text-ink-soft">
                    {todosDone}/{todos.length} to-dos
                  </span>
                )}
                {log?.is_fast_day && <span className="rounded-full bg-pink px-2 font-semibold text-on-pink">Fast</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Bold steps = goal reached. Shaded days are your days off.
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <TodayPage date={selected} />
      </div>
    </div>
  );
}