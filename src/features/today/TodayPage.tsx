import { formatLongDate, todayISO, weekdayOf } from "../../lib/dates";
import { useDailyLog, useSaveDailyLog, useSettings } from "./api";
import { NumberCard } from "./NumberCard";
import { WaterCard } from "./WaterCard";
import { ExercisesCard } from "./ExercisesCard";
import { TodosCard } from "./TodosCard";

export function TodayPage() {
  const date = todayISO();
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg text-ink-soft">{formatLongDate(date)}</p>
        <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-card px-4 py-2 font-semibold">
          <input
            type="checkbox"
            checked={isFastDay}
            disabled={save.isPending}
            onChange={() => save.mutate({ is_fast_day: !isFastDay })}
            className="h-5 w-5 accent-pink"
          />
          Fast day
          {isScheduledFast && !isFastDay && (
            <span className="text-sm font-normal text-ink-soft">(scheduled today)</span>
          )}
        </label>
      </div>

      {save.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not save: {save.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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