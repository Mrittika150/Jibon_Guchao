import { Card } from "../../components/Card";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { Sticker } from "../../components/stickers/Sticker";
import { formatShortDate } from "../../lib/dates";
import { formatTaka } from "../../lib/money";
import { useDeleteExpense, type Expense } from "./api";
import { categoryLabel } from "./categories";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const deleteExpense = useDeleteExpense();

  return (
    <Card title="This month" sticker="bunny">
      {expenses.length === 0 ? (
        <p className="flex items-center gap-2 text-ink-soft">
          <Sticker name="bear" className="h-8 w-8" />
          Nothing spent this month yet.
        </p>
      ) : (
        <ul className="-mr-2 flex max-h-44 flex-col gap-1 overflow-y-auto pr-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-card-soft">
              <span className="w-14 shrink-0 text-sm text-ink-soft">{formatShortDate(expense.spent_on)}</span>
              <span className="min-w-0 flex-1 truncate">
                <span className="font-semibold">{categoryLabel(expense.category)}</span>
                {expense.note && <span className="text-ink-soft"> · {expense.note}</span>}
              </span>
              <span className="shrink-0 font-bold">{formatTaka(expense.amount_paisa)}</span>
              <button
                type="button"
                onClick={() => deleteExpense.mutate(expense.id)}
                aria-label={`Delete ${categoryLabel(expense.category)} expense of ${formatTaka(expense.amount_paisa)}`}
                title="Delete"
                className="shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}