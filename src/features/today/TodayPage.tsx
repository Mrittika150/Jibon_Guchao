import { addDays, formatLongDate, todayISO, weekdayOf } from "../../lib/dates";
import { useDailyLog, useSaveDailyLog, useSettings } from "./api";
import { NumberCard } from "./NumberCard";
import { WaterCard } from "./WaterCard";
import { ExercisesCard } from "./ExercisesCard";
import { TodosCard } from "./TodosCard";

type TodayPageProps = {
  date: string;
  onChangeDate: (date: string) => void;
};

export function TodayPage({ date, onChangeDate }: TodayPageProps) {
  const settings = useSettings();
  const log = useDailyLog(date);
  const save = useSaveDailyLog(date);

  if (settings.isPending || log.isPending) {
    return <p className="text-ink-soft">Loading your day...</p>;
  }
  if (settings.isError || log.isError) {
    return (
      <p role="alert" className="rounded-2xl bg-card-soft p-4">
        Could not load today: {(settings.error ?? log.error)?.message}
      </p>
    );
  }

  const goals = settings.data;
  const today = log.data;
  const isScheduledFast = goals.fast_days.includes(weekdayOf(date));
  const isFastDay = today?.is_fast_day ?? false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeDate(addDays(date, -1))}
          className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft"
        >
          Previous day
        </button>
        <p className="min-w-52 text-center text-lg font-semibold" aria-live="polite">
          {formatLongDate(date)}
        </p>
        <button
          type="button"
          onClick={() => onChangeDate(addDays(date, 1))}
          className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft"
        >
          Next day
        </button>
        {date !== todayISO() && (
          <button
            type="button"
            onClick={() => onChangeDate(todayISO())}
            className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink"
          >
            Back to today
          </button>
        )}
        <label className="ml-auto flex cursor-pointer items-center gap-2 rounded-2xl bg-card px-3 py-1.5 font-semibold">
          <input
            type="checkbox"
            checked={isFastDay}
            disabled={save.isPending}
            onChange={() => save.mutate({ is_fast_day: !isFastDay })}
            className="h-5 w-5 accent-pink"
          />
          Fast day
          {isScheduledFast && !isFastDay && (
            <span className="text-sm font-normal text-ink-soft">(scheduled)</span>
          )}
        </label>
      </div>

      {save.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not save: {save.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NumberCard
          title="Steps"
          icon="/assets/person.png"
          unit="steps"
          saved={today?.steps ?? null}
          goal={goals.step_goal}
          saving={save.isPending}
          onSave={(steps) => save.mutate({ steps })}
        />
        <WaterCard
          saved={today?.water_ml ?? null}
          goal={goals.water_goal_ml}
          saving={save.isPending}
          onSave={(water_ml) => save.mutate({ water_ml })}
        />
        <NumberCard
          title="Walk"
          icon="/assets/location.png"
          unit="min"
          saved={today?.walk_minutes ?? null}
          saving={save.isPending}
          onSave={(walk_minutes) => save.mutate({ walk_minutes })}
        />
        <NumberCard
          title="Weight"
          unit="kg"
          step={0.1}
          saved={today?.weight_kg ?? null}
          saving={save.isPending}
          onSave={(weight_kg) => save.mutate({ weight_kg })}
        />
        <ExercisesCard date={date} />
        <TodosCard date={date} />
      </div>
    </div>
  );
}