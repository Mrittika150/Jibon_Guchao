import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { useAddFood, useDeleteFood, useFoods, type FoodStatus } from "./api";

const GROUPS: { status: FoodStatus; label: string }[] = [
  { status: "love", label: "Love" },
  { status: "avoid", label: "Avoid" },
  { status: "ask", label: "Ask my dietitian" },
];

export function FoodListCard() {
  const foods = useFoods();
  const addFood = useAddFood();
  const deleteFood = useDeleteFood();

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() ?? "";
    if (name === "") return;
    addFood.mutate({ name, status: data.get("status")?.toString() as FoodStatus }, { onSuccess: () => form.reset() });
  }

  return (
    <Card title="My food list" sticker="drop">
      <div className="-mr-2 flex max-h-44 flex-col gap-2 overflow-y-auto pr-2">
        {GROUPS.map((group) => {
          const items = (foods.data ?? []).filter((food) => food.status === group.status);
          return (
            <div key={group.status}>
              <h4 className="mb-1 text-sm font-semibold text-ink-soft">{group.label}</h4>
              {items.length === 0 ? (
                <p className="text-sm text-ink-soft opacity-70">Nothing here yet</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {items.map((food) => (
                    <li
                      key={food.id}
                      className={`flex items-center gap-1 rounded-full py-0.5 pr-1 pl-3 text-sm font-semibold ${
                        group.status === "love" ? "bg-pink text-on-pink" : "bg-card-soft"
                      }`}
                    >
                      {food.name}
                      <button
                        type="button"
                        onClick={() => deleteFood.mutate(food.id)}
                        aria-label={`Remove ${food.name}`}
                        title="Remove"
                        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-card"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {addFood.isError && (
        <p role="alert" className="text-sm">
          {addFood.error.message.includes("duplicate") ? "That food is already on your list." : `Could not save: ${addFood.error.message}`}
        </p>
      )}

      <form onSubmit={handleAdd} className="mt-auto flex gap-2">
        <input
          name="name"
          required
          maxLength={60}
          placeholder="Add a food"
          aria-label="Food name"
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5"
        />
        <select name="status" defaultValue="love" aria-label="List" className="rounded-2xl border border-line bg-page px-2 py-1.5">
          {GROUPS.map((group) => (
            <option key={group.status} value={group.status}>
              {group.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={addFood.isPending} className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60">
          Add
        </button>
      </form>
    </Card>
  );
}
