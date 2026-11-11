import type { FormEvent } from "react";
import { Card } from "../../components/Card";
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
    <Card title="Exercise" icon="/assets/person.png">
      {exercises.isPending && <p className="text-ink-soft">Loading...</p>}
      {exercises.data?.length === 0 && (
        <p className="text-ink-soft">No exercises yet. Add your first one below.</p>
      )}

      <ul className="flex flex-col gap-2">
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

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          name="name"
          maxLength={100}
          placeholder="New exercise"
          aria-label="New exercise name"
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-2"
        />
        <button
          type="submit"
          disabled={addExercise.isPending}
          className="rounded-2xl bg-card-soft px-4 py-2 font-bold disabled:opacity-60"
        >
          Add
        </button>
      </form>
    </Card>
  );
}