import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { Sticker } from "../../components/stickers/Sticker";
import { useAddExercise, useExerciseLogs, useExercises, useToggleExercise } from "./api";

export function ExercisesCard({ date }: { date: string }) {
  const exercises = useExercises();
  const logs = useExerciseLogs(date);
  const addExercise = useAddExercise();
  const toggle = useToggleExercise(date);

  const doneIds = new Set(logs.data?.map((log) => log.exercise_id));

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = new FormData(form).get("name")?.toString().trim() ?? "";
    if (name === "") return;
    addExercise.mutate(name, { onSuccess: () => form.reset() });
  }

  return (
    <Card title="Exercise" icon="/assets/person.png" sticker="bat">
      {exercises.isPending && <p className="text-ink-soft">Loading...</p>}
      {exercises.data?.length === 0 && (
        <p className="flex items-center gap-2 text-ink-soft">
          <Sticker name="mocha" className="h-8 w-8" />
          No exercises yet. Add your first one below.
        </p>
      )}

      <ul className="-mr-2 flex max-h-24 flex-col gap-1 overflow-y-auto pr-2">
        {exercises.data?.map((exercise) => {
          const done = doneIds.has(exercise.id);
          return (
            <li key={exercise.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-1 hover:bg-card-soft">
                <input
                  type="checkbox"
                  checked={done}
                  disabled={toggle.isPending}
                  onChange={() => toggle.mutate({ exerciseId: exercise.id, done: !done })}
                  className="h-5 w-5 accent-pink"
                />
                <span className={done ? "text-ink-soft line-through" : ""}>{exercise.name}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAdd} className="mt-auto flex gap-2">
        <input
          name="name"
          maxLength={100}
          placeholder="New exercise"
          aria-label="New exercise name"
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5"
        />
        <button
          type="submit"
          disabled={addExercise.isPending}
          className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60"
        >
          Add
        </button>
      </form>
    </Card>
  );
}