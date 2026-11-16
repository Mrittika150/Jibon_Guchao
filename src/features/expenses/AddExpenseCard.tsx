import { useState, type FormEvent } from "react";
import { Card } from "../../components/Card";
import { todayISO } from "../../lib/dates";
import { parseTaka } from "../../lib/money";
import { useAddExpense } from "./api";
import { CATEGORIES, type CategoryId } from "./categories";

const FIELD = "w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5";

export function AddExpenseCard() {
  const addExpense = useAddExpense();
  const [problem, setProblem] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const amountPaisa = parseTaka(data.get("amount")?.toString() ?? "");
    if (amountPaisa === null) {
      setProblem("Type an amount like 120 or 120.50");
      return;
    }
    setProblem(null);

    const note = data.get("note")?.toString().trim() ?? "";
    addExpense.mutate(
      {
        spent_on: data.get("spent_on")?.toString() || todayISO(),
        amount_paisa: amountPaisa,
        category: data.get("category")?.toString() as CategoryId,
        note: note === "" ? null : note,
      },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <Card title="Add expense" sticker="mocha">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Amount (taka)
            <input name="amount" inputMode="decimal" placeholder="120" required className={`${FIELD} font-normal`} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Category
            <select name="category" defaultValue="food" className={`${FIELD} font-normal`}>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Date
            <input name="spent_on" type="date" defaultValue={todayISO()} required className={`${FIELD} font-normal`} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Note (optional)
            <input name="note" maxLength={200} placeholder="lunch" className={`${FIELD} font-normal`} />
          </label>
        </div>

        {(problem || addExpense.isError) && (
          <p role="alert" className="rounded-2xl bg-card-soft px-3 py-1.5 text-sm">
            {problem ?? `Could not save: ${addExpense.error?.message}`}
          </p>
        )}

        <button
          type="submit"
          disabled={addExpense.isPending}
          className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60"
        >
          {addExpense.isPending ? "Saving" : "Add expense"}
        </button>
      </form>
    </Card>
  );
}