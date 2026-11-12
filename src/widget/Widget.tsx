import { useEffect, useState } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { useDailyLog, useSaveDailyLog, useSettings, useTodos, useUpdateTodo } from "../features/today/api";
import { formatLongDate, todayISO } from "../lib/dates";
import { setWidgetVisible } from "./widgetWindow";

const GLASS_ML = 250;
const MAX_TODOS = 4;

// Today's date, checked again every minute, so the widget moves on after midnight
function useToday(): string {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    const timer = setInterval(() => setToday(todayISO()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return today;
}

export function Widget() {
  const today = useToday();
  const settings = useSettings();
  const log = useDailyLog(today);
  const save = useSaveDailyLog(today);
  const todos = useTodos(today);
  const updateTodo = useUpdateTodo();

  const steps = log.data?.steps ?? 0;
  const water = log.data?.water_ml ?? 0;
  const stepGoal = settings.data?.step_goal ?? 10000;
  const waterGoal = settings.data?.water_goal_ml ?? 2000;
  const openTodos = (todos.data ?? []).filter((todo) => !todo.done);
  const moreCount = openTodos.length - MAX_TODOS;
  const hasError = settings.isError || log.isError || todos.isError;

  return (
    <div className="flex h-screen flex-col gap-2 p-2.5 text-sm">
      <header
        data-tauri-drag-region
        className="flex cursor-move items-center justify-between gap-2 rounded-2xl bg-card px-3 py-1.5"
      >
        <p data-tauri-drag-region className="font-bold">
          {formatLongDate(today)}
        </p>
        <button
          type="button"
          onClick={() => setWidgetVisible(false)}
          className="rounded-xl px-2 py-0.5 text-ink-soft hover:bg-card-soft hover:text-ink"
        >
          Hide
        </button>
      </header>

      {hasError && (
        <p role="alert" className="px-1 text-xs text-ink-soft">
          Could not load. Check your internet.
        </p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
        {/* Left column: steps on top, water below */}
        <div className="flex min-h-0 flex-col gap-2">
          <section className="flex flex-1 flex-col justify-center gap-1.5 rounded-2xl bg-card p-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-bold">Steps</h2>
              <p>
                <span className="font-bold">{steps.toLocaleString()}</span>
                <span className="text-xs text-ink-soft"> / {stepGoal.toLocaleString()}</span>
              </p>
            </div>
            <ProgressBar value={steps} goal={stepGoal} label="Steps progress" />
          </section>

          <section className="flex flex-1 flex-col justify-center gap-1.5 rounded-2xl bg-card p-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-bold">Water</h2>
              <p>
                <span className="font-bold">{water}</span>
                <span className="text-xs text-ink-soft"> / {waterGoal} ml</span>
              </p>
            </div>
            <ProgressBar value={water} goal={waterGoal} label="Water progress" />
            <button
              type="button"
              disabled={save.isPending}
              onClick={() => save.mutate({ water_ml: water + GLASS_ML })}
              className="mt-1 rounded-xl bg-pink px-3 py-1 font-bold text-on-pink disabled:opacity-60"
            >
              + 1 glass
            </button>
          </section>
        </div>

        {/* Right column: to-dos, full height */}
        <section className="flex min-h-0 flex-col gap-1 rounded-2xl bg-card p-3">
          <h2 className="font-bold">To-dos</h2>
          {todos.isSuccess && openTodos.length === 0 && <p className="text-ink-soft">All done for today.</p>}
          <ul className="flex flex-col gap-0.5 overflow-y-auto">
            {openTodos.slice(0, MAX_TODOS).map((todo) => (
              <li key={todo.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl px-1 py-0.5 hover:bg-card-soft">
                  <input
                    type="checkbox"
                    checked={false}
                    disabled={updateTodo.isPending}
                    onChange={() => updateTodo.mutate({ id: todo.id, done: true })}
                    className="h-4 w-4 shrink-0 accent-pink"
                  />
                  <span className="truncate">{todo.title}</span>
                </label>
              </li>
            ))}
          </ul>
          {moreCount > 0 && <p className="mt-auto text-xs text-ink-soft">+ {moreCount} more in the app</p>}
        </section>
      </div>
    </div>
  );
}
