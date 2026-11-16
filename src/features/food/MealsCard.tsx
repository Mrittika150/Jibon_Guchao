import { useState, type FormEvent } from "react";
import { Card } from "../../components/Card";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { Sticker } from "../../components/stickers/Sticker";
import { useAddMeal, useDeleteMeal, useMealLogs, useMealPlan, useToggleMeal, type DayType } from "./api";
import { formatMealTime, nextMeal } from "./mealTime";

const FIELD = "w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5";

type MealsCardProps = {
  date: string;
  dayType: DayType;
  isToday: boolean;
};

export function MealsCard({ date, dayType, isToday }: MealsCardProps) {
  const [editing, setEditing] = useState(false);
  const [planShown, setPlanShown] = useState<DayType>(dayType); // which plan you edit
  const shownType = editing ? planShown : dayType;

  const plan = useMealPlan(shownType);
  const eatenIds = new Set(useMealLogs(date).data ?? []);
  const toggle = useToggleMeal(date);
  const addMeal = useAddMeal();
  const deleteMeal = useDeleteMeal();

  const meals = plan.data ?? [];
  const now = new Date();
  const upcoming = isToday ? nextMeal(meals, now.getHours() * 60 + now.getMinutes()) : null;
  const eatenCount = meals.filter((meal) => eatenIds.has(meal.id)).length;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() ?? "";
    const time = data.get("meal_time")?.toString() ?? "";
    if (name === "" || time === "") return;
    addMeal.mutate(
      { day_type: planShown, meal_time: time, name, food: data.get("food")?.toString().trim() ?? "" },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <Card title={editing ? "Edit meal plan" : dayType === "fast" ? "Fast-day meals" : "Today's meals"} sticker="strawberry">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {editing ? (
          <div role="group" aria-label="Which plan" className="flex gap-1 rounded-2xl bg-card-soft p-1">
            {(["normal", "fast"] as const).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={planShown === type}
                onClick={() => setPlanShown(type)}
                className={`rounded-xl px-3 py-1 text-sm font-semibold ${planShown === type ? "bg-pink text-on-pink" : "text-ink-soft"}`}
              >
                {type === "normal" ? "Normal days" : "Fast days"}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">
            {meals.length > 0 ? `${eatenCount} of ${meals.length} meals done` : "No meals planned yet"}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setPlanShown(dayType);
            setEditing(!editing);
          }}
          className="rounded-2xl bg-card-soft px-3 py-1.5 text-sm font-semibold"
        >
          {editing ? "Done" : "Edit plan"}
        </button>
      </div>

      {editing && planShown === "fast" && (
        <p className="rounded-2xl bg-card-soft px-3 py-2 text-sm">
          Only add what your dietitian has approved for fast days.
        </p>
      )}

      {meals.length === 0 && !editing && (
        <p className="flex items-center gap-2 text-ink-soft">
          <Sticker name="bear" className="h-8 w-8" />
          Click "Edit plan" to add your meals.
        </p>
      )}

      <ul className={`-mr-2 flex flex-col gap-1 overflow-y-auto pr-2 ${editing ? "max-h-40" : "max-h-64"}`}>
        {meals.map((meal) => {
          const eaten = eatenIds.has(meal.id);
          const isNext = upcoming?.id === meal.id && !eaten;
          return (
            <li
              key={meal.id}
              className={`flex items-center gap-3 rounded-2xl px-2 py-1.5 ${isNext ? "bg-card-soft" : "hover:bg-card-soft"}`}
            >
              {!editing && (
                <input
                  type="checkbox"
                  checked={eaten}
                  disabled={toggle.isPending}
                  onChange={() => toggle.mutate({ mealId: meal.id, eaten: !eaten })}
                  aria-label={`Had ${meal.name}`}
                  className="h-5 w-5 shrink-0 accent-pink"
                />
              )}
              <span className="w-16 shrink-0 text-sm text-ink-soft">{formatMealTime(meal.meal_time)}</span>
              <span className={`min-w-0 flex-1 ${eaten && !editing ? "text-ink-soft line-through" : ""}`}>
                <span className="font-semibold">{meal.name}</span>
                {meal.food && <span className="block truncate text-sm text-ink-soft">{meal.food}</span>}
              </span>
              {isNext && !editing && (
                <span className="shrink-0 rounded-full bg-pink px-2 text-xs font-semibold text-on-pink">Next</span>
              )}
              {editing && (
                <button
                  type="button"
                  onClick={() => deleteMeal.mutate(meal.id)}
                  aria-label={`Delete ${meal.name} at ${formatMealTime(meal.meal_time)}`}
                  title="Delete"
                  className="shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink"
                >
                  <TrashIcon />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {editing && (
        <form onSubmit={handleAdd} className="mt-auto grid grid-cols-[7rem_minmax(0,1fr)] gap-2">
          <input name="meal_time" type="time" required aria-label="Meal time" className={FIELD} />
          <input name="name" required maxLength={40} placeholder="Meal name, e.g. Lunch" aria-label="Meal name" className={FIELD} />
          <input name="food" maxLength={300} placeholder="What you'll eat" aria-label="Food" className={`${FIELD} col-span-2`} />
          <button
            type="submit"
            disabled={addMeal.isPending}
            className="col-span-2 rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60"
          >
            Add to {planShown === "fast" ? "fast-day" : "normal-day"} plan
          </button>
        </form>
      )}
    </Card>
  );
}
