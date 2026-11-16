import { Card } from "../../components/Card";
import { Sticker } from "../../components/stickers/Sticker";
import { formatShortDate } from "../../lib/dates";
import type { JournalEntry } from "./api";
import { moodLabel } from "./moods";
import { previewOf } from "./preview";

type JournalMonthListProps = {
  entries: JournalEntry[];
  selected: string;
  onSelect: (date: string) => void;
};

export function JournalMonthList({ entries, selected, onSelect }: JournalMonthListProps) {
  // Hide days where you only opened the page and wrote nothing
  const written = entries.filter((entry) => entry.body.trim() !== "" || entry.mood !== null);

  return (
    <Card title="This month" sticker="cloud">
      {written.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <Sticker name="bear" className="h-8 w-8" />
          No entries yet this month.
        </p>
      ) : (
        <ul className="-mr-2 flex max-h-96 flex-col gap-1 overflow-y-auto pr-2">
          {written.map((entry) => (
            <li key={entry.entry_date}>
              <button
                type="button"
                onClick={() => onSelect(entry.entry_date)}
                aria-current={entry.entry_date === selected ? "date" : undefined}
                className={`flex w-full flex-col gap-0.5 rounded-2xl px-3 py-2 text-left text-sm ${
                  entry.entry_date === selected ? "bg-card-soft" : "hover:bg-card-soft"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{formatShortDate(entry.entry_date)}</span>
                  {entry.mood && (
                    <span className="rounded-full bg-pink px-2 text-xs font-semibold text-on-pink">
                      {moodLabel(entry.mood)}
                    </span>
                  )}
                </span>
                <span className="truncate text-ink-soft">{previewOf(entry.body) || "No words, just a mood"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
