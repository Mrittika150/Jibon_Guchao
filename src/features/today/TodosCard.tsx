import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { useAddTodo, useDeleteTodo, useTodos, useUpdateTodo } from "./api";

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
    <Card title="To-dos" icon="/assets/to-do-list.png">
      {todos.isPending && <p className="text-ink-soft">Loading...</p>}
      {todos.data?.length === 0 && <p className="text-ink-soft">Nothing to do. Enjoy your day.</p>}

      <ul className="flex flex-col gap-2">
        {todos.data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-card-soft">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => updateTodo.mutate({ id: todo.id, done: !todo.done })}
              aria-label={`Mark "${todo.title}" as done`}
              className="h-5 w-5 accent-pink"
            />
            <span className={`flex-1 ${todo.done ? "text-ink-soft line-through" : ""}`}>
              {todo.title}
              {todo.due_date !== null && todo.due_date < date && (
                <span className="ml-2 text-xs font-semibold text-ink-soft">(from {todo.due_date})</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => deleteTodo.mutate(todo.id)}
              aria-label={`Delete "${todo.title}"`}
              className="rounded-xl px-2 text-ink-soft hover:text-ink"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          name="title"
          maxLength={200}
          placeholder="New to-do"
          aria-label="New to-do"
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-2"
        />
        <button
          type="submit"
          disabled={addTodo.isPending}
          className="rounded-2xl bg-card-soft px-4 py-2 font-bold disabled:opacity-60"
        >
          Add
        </button>
      </form>
    </Card>
  );
}