import { useState, type FormEvent } from "react";
import { Card } from "../../components/Card";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { ProgressBar } from "../../components/ProgressBar";
import { Sticker } from "../../components/stickers/Sticker";
import { useAddCourse, useAddLesson, useCourses, useDeleteCourse, useDeleteLesson, useToggleLesson } from "./api";
import { FIELD } from "./PracticeTab";

export function CoursesTab() {
  const data = useCourses();
  const addCourse = useAddCourse();
  const deleteCourse = useDeleteCourse();
  const addLesson = useAddLesson();
  const toggleLesson = useToggleLesson();
  const deleteLesson = useDeleteLesson();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const courses = data.data?.courses ?? [];
  const lessons = data.data?.lessons ?? [];
  // If nothing is picked (or the picked course was deleted), show the first course
  const selected = courses.find((course) => course.id === selectedId) ?? courses[0] ?? null;
  const lessonsOf = (courseId: string) => lessons.filter((lesson) => lesson.course_id === courseId);
  const selectedLessons = selected ? lessonsOf(selected.id) : [];

  function handleAddCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = new FormData(form).get("name")?.toString().trim() ?? "";
    if (name === "") return;
    addCourse.mutate(name, { onSuccess: () => form.reset() });
  }

  function handleAddLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = new FormData(form).get("title")?.toString().trim() ?? "";
    if (title === "" || !selected) return;
    addLesson.mutate({ course_id: selected.id, title }, { onSuccess: () => form.reset() });
  }

  return (
    <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Card title="My courses" sticker="star">
        {courses.length === 0 && <p className="text-sm text-ink-soft">No courses yet.</p>}
        <ul className="-mr-2 flex max-h-72 flex-col gap-1 overflow-y-auto pr-2">
          {courses.map((course) => {
            const all = lessonsOf(course.id);
            const done = all.filter((lesson) => lesson.done).length;
            const percent = all.length === 0 ? 0 : Math.round((done / all.length) * 100);
            return (
              <li key={course.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(course.id)}
                  aria-current={course.id === selected?.id ? "true" : undefined}
                  className={`flex w-full flex-col gap-1 rounded-2xl px-3 py-2 text-left ${
                    course.id === selected?.id ? "bg-card-soft" : "hover:bg-card-soft"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate font-semibold">{course.name}</span>
                    <span className="shrink-0 text-ink-soft">{percent}%</span>
                  </span>
                  <ProgressBar value={done} goal={Math.max(all.length, 1)} label={`${course.name} progress`} />
                </button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={handleAddCourse} className="mt-auto flex gap-2">
          <input name="name" required maxLength={100} placeholder="New course" aria-label="Course name" className={FIELD} />
          <button type="submit" disabled={addCourse.isPending} className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60">
            Add
          </button>
        </form>
      </Card>

      <Card title={selected ? selected.name : "Lessons"} sticker="bow">
        {!selected ? (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Sticker name="bear" className="h-8 w-8" />
            Add a course on the left, then list its lessons here.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 text-sm text-ink-soft">
              <span>
                {selectedLessons.filter((lesson) => lesson.done).length} of {selectedLessons.length} lessons done
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete the course "${selected.name}" and its lessons? Its deadlines stay.`)) {
                    deleteCourse.mutate(selected.id);
                    setSelectedId(null);
                  }
                }}
                className="rounded-xl px-2 py-1 font-semibold hover:bg-card-soft hover:text-ink"
              >
                Delete course
              </button>
            </div>
            <ul className="-mr-2 flex max-h-64 flex-col gap-1 overflow-y-auto pr-2">
              {selectedLessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-card-soft">
                  <input
                    type="checkbox"
                    checked={lesson.done}
                    onChange={() => toggleLesson.mutate({ id: lesson.id, done: !lesson.done })}
                    aria-label={`Mark "${lesson.title}" as done`}
                    className="h-5 w-5 shrink-0 accent-pink"
                  />
                  <span className={`min-w-0 flex-1 break-words ${lesson.done ? "text-ink-soft line-through" : ""}`}>{lesson.title}</span>
                  <button
                    type="button"
                    onClick={() => deleteLesson.mutate(lesson.id)}
                    aria-label={`Delete lesson "${lesson.title}"`}
                    title="Delete"
                    className="shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddLesson} className="mt-auto flex gap-2">
              <input name="title" required maxLength={200} placeholder="New lesson or module" aria-label="Lesson title" className={FIELD} />
              <button type="submit" disabled={addLesson.isPending} className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60">
                Add
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
