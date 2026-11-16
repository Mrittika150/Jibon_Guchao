import { useState } from "react";
import { addDays, formatLongDate, fromISODate, toISODate, todayISO } from "../../lib/dates";
import { useJournalEntry, useJournalMonth } from "./api";
import { JournalEditor } from "./JournalEditor";
import { JournalMonthList } from "./JournalMonthList";

export function JournalPage() {
  const [date, setDate] = useState(todayISO);
  const entry = useJournalEntry(date);

  // The month of the selected day, for the list on the right
  const day = fromISODate(date);
  const monthStart = toISODate(new Date(day.getFullYear(), day.getMonth(), 1));
  const monthEnd = toISODate(new Date(day.getFullYear(), day.getMonth() + 1, 0));
  const month = useJournalMonth(monthStart, monthEnd);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setDate(addDays(date, -1))} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Previous day
        </button>
        <p className="min-w-52 text-center text-lg font-semibold" aria-live="polite">
          {formatLongDate(date)}
        </p>
        <button type="button" onClick={() => setDate(addDays(date, 1))} className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft">
          Next day
        </button>
        {date !== todayISO() && (
          <button type="button" onClick={() => setDate(todayISO())} className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink">
            Back to today
          </button>
        )}
      </div>

      {(entry.isError || month.isError) && (
        <p role="alert" className="rounded-2xl bg-card-soft p-4">
          Could not load your journal: {(entry.error ?? month.error)?.message}
        </p>
      )}

      <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        {entry.isPending ? (
          <p className="text-ink-soft">Opening your journal...</p>
        ) : (
          <JournalEditor key={date} date={date} entry={entry.data ?? null} />
        )}
        <JournalMonthList entries={month.data ?? []} selected={date} onSelect={setDate} />
      </div>
    </div>
  );
}
