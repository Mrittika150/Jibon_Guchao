import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { Sticker } from "../../components/stickers/Sticker";
import { formatShortDate, todayISO } from "../../lib/dates";
import { useAddDeadline, useCourses, useDeadlines, useDeleteDeadline, useToggleDeadline, type Deadline } from "./api";
import { FIELD } from "./PracticeTab";
import { daysUntil, dueLabel } from "./studyTime";

export function DeadlinesTab() {
  const today = todayISO();
  const deadlines = useDeadlines();
  const courses = useCourses().data?.courses ?? [];
  const addDeadline = useAddDeadline();
  const toggle = useToggleDeadline();
  const remove = useDeleteDeadline();

  const all = deadlines.data ?? [];
  const open = all.filter((deadline) => !deadline.done); // already sorted by due date
  const finished = all.filter((deadline) => deadline.done).reverse(); // newest first
  const courseName = (id: string | null) => courses.find((course) => course.id === id)?.name;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = data.get("title")?.toString().trim() ?? "";
    if (title === "") return;
    addDeadline.mutate(
      {
        title,
        due_date: data.get("due_date")?.toString() || today,
        course_id: data.get("course_id")?.toString() || null,
      },
      { onSuccess: () => form.reset() },
    );
  }

  // A plain function (not a component), so React keeps the same rows between renders
  function renderRow(deadline: Deadline) {
    const days = daysUntil(deadline.due_date, today);
    const urgent = !deadline.done && days <= 2; // late, today, tomorrow or the day after
    return (
      <li key={deadline.id} className="flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-card-soft">
        <input
          type="checkbox"
          checked={deadline.done}
          onChange={() => toggle.mutate({ id: deadline.id, done: !deadline.done })}
          aria-label={`Mark "${deadline.title}" as done`}
          className="h-5 w-5 shrink-0 accent-pink"
        />
        <span className={`min-w-0 flex-1 ${deadline.done ? "text-ink-soft line-through" : ""}`}>
          <span className="block truncate font-semibold">{deadline.title}</span>
          <span className="block truncate text-sm text-ink-soft">
            {formatShortDate(deadline.due_date)}
            {courseName(deadline.course_id) && ` · ${courseName(deadline.course_id)}`}
          </span>
        </span>
        {!deadline.done && (
          <span
            className={`shrink-0 rounded-full px-2 text-xs font-semibold ${urgent ? "bg-pink text-on-pink" : "bg-card-soft text-ink-soft"}`}
          >
            {dueLabel(deadline.due_date, today)}
          </span>
        )}
        <button
          type="button"
          onClick={() => remove.mutate(deadline.id)}
          aria-label={`Delete deadline "${deadline.title}"`}
          title="Delete"
          className="shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink"
        >
          <TrashIcon />
        </button>
      </li>
    );
  }

  return (
    <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card title="Coming up" sticker="bunny">
        {open.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Sticker name="bear" className="h-8 w-8" />
            Nothing due. Enjoy the calm.
          </p>
        ) : (
          <ul className="-mr-2 flex max-h-96 flex-col gap-1 overflow-y-auto pr-2">
            {open.map(renderRow)}
          </ul>
        )}
      </Card>

      <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
        <Card title="Add deadline" sticker="drop">
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <input name="title" required maxLength={200} placeholder="Assignment, exam..." aria-label="Deadline title" className={FIELD} />
            <div className="grid grid-cols-2 gap-2">
              <input name="due_date" type="date" defaultValue={today} required aria-label="Due date" className={FIELD} />
              <select name="course_id" defaultValue="" aria-label="Course (optional)" className={FIELD}>
                <option value="">No course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={addDeadline.isPending} className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60">
              Add deadline
            </button>
          </form>
        </Card>

        <Card title="Done" sticker="sparkle">
          {finished.length === 0 ? (
            <p className="text-sm text-ink-soft">Finished deadlines show up here.</p>
          ) : (
            <ul className="-mr-2 flex max-h-40 flex-col gap-1 overflow-y-auto pr-2">
              {finished.map(renderRow)}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
