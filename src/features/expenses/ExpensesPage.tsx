import { useState } from "react";
import { formatMonth, toISODate } from "../../lib/dates";
import { formatTaka } from "../../lib/money";
import { StatTile } from "../health/StatTile";
import { AddExpenseCard } from "./AddExpenseCard";
import { useExpenses } from "./api";
import { categoryLabel, type CategoryId } from "./categories";
import { CategoryChart, type CategoryTotal } from "./CategoryChart";
import { ExpenseList } from "./ExpenseList";

export function ExpensesPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());

  const from = toISODate(new Date(year, month, 1));
  const to = toISODate(new Date(year, month + 1, 0)); // day 0 of next month = last day of this one
  const expenses = useExpenses(from, to);
  const list = expenses.data ?? [];

  function changeMonth(by: number) {
    const next = new Date(year, month + by, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  // Totals, all in whole paisa
  const total = list.reduce((sum, expense) => sum + expense.amount_paisa, 0);
  const now = new Date();
  const isThisMonth = year === now.getFullYear() && month === now.getMonth();
  const daysCounted = isThisMonth ? now.getDate() : new Date(year, month + 1, 0).getDate();
  const dailyAverage = Math.round(total / daysCounted);

  const byCategory = new Map<CategoryId, number>();
  for (const expense of list) {
    byCategory.set(expense.category, (byCategory.get(expense.category) ?? 0) + expense.amount_paisa);
  }
  const totals: CategoryTotal[] = [...byCategory]
    .map(([category, paisa]) => ({ label: categoryLabel(category), paisa }))
    .sort((a, b) => b.paisa - a.paisa);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => changeMonth(-1)} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Previous
        </button>
        <h3 className="min-w-44 text-center text-lg font-bold" aria-live="polite">
          {formatMonth(year, month)}
        </h3>
        <button type="button" onClick={() => changeMonth(1)} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Next
        </button>
      </div>

      {expenses.isError && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not load expenses: {expenses.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
          <AddExpenseCard />
          <ExpenseList expenses={list} />
        </div>

        <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
          <div className="grid grid-cols-2 gap-4">
            <StatTile sticker="flower" label="Spent this month" value={formatTaka(total)} detail={`${list.length} expenses`} />
            <StatTile
              sticker="sparkle"
              label="Daily average"
              value={formatTaka(dailyAverage)}
              detail={isThisMonth ? `over ${daysCounted} days so far` : `over ${daysCounted} days`}
            />
          </div>
          <CategoryChart totals={totals} />
        </div>
      </div>
    </div>
  );
}