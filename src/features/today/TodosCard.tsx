import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { Sticker } from "../../components/stickers/Sticker";
import { useAddTodo, useDeleteTodo, useTodos, useUpdateTodo } from "./api";

// A small bin icon. "currentColor" means it uses the button's text colour, so it fits both themes.
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function TodosCard({ date }: { date: string }) {
  const todos = useTodos(date);
  const addTodo = useAddTodo(date);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = new FormData(form).get("title")?.toString().trim() ?? "";
    if (title === "") return;
    addTodo.mutate(title, { onSuccess: () => form.reset() });
  }

  return (
    <Card title="To-dos" icon="/assets/to-do-list.png" sticker="bow">
      {todos.isPending && <p className="text-ink-soft">Loading...</p>}
      {todos.data?.length === 0 && (
        <p className="flex items-center gap-2 text-ink-soft">
          <Sticker name="bear" className="h-8 w-8" />
          Nothing to do. Enjoy your day.
        </p>
      )}

      {/* The list scrolls inside the card instead of making the card taller */}
      <ul className="-mr-2 flex max-h-24 flex-col gap-1 overflow-y-auto pr-2">
        {todos.data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 rounded-2xl px-2 py-1 hover:bg-card-soft">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => updateTodo.mutate({ id: todo.id, done: !todo.done })}
              aria-label={`Mark "${todo.title}" as done`}
              className="h-5 w-5 shrink-0 accent-pink"
            />
            <span className={`min-w-0 flex-1 break-words ${todo.done ? "text-ink-soft line-through" : ""}`}>
              {todo.title}
              {todo.due_date !== null && todo.due_date < date && (
                <span className="ml-2 text-xs font-semibold text-ink-soft">(from {todo.due_date})</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => deleteTodo.mutate(todo.id)}
              aria-label={`Delete "${todo.title}"`}
              title="Delete"
              className="shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-auto flex gap-2">
        <input
          name="title"
          maxLength={200}
          placeholder="New to-do"
          aria-label="New to-do"
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5"
        />
        <button
          type="submit"
          disabled={addTodo.isPending}
          className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60"
        >
          Add
        </button>
      </form>
    </Card>
  );
}