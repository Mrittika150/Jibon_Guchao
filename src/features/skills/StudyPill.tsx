import { useStudySummary } from "./api";
import { formatMinutes } from "./studyTime";

// A small line for the Today page: minutes studied, and unfinished deadlines due by then
export function StudyPill({ date }: { date: string }) {
  const summary = useStudySummary(date);
  const minutes = summary.data?.minutes ?? 0;
  const dueCount = summary.data?.dueCount ?? 0;

  return (
    <p className="ml-auto flex items-center gap-2 text-sm" aria-live="polite">
      {summary.isSuccess && (
        <>
          <span className="rounded-2xl bg-card px-3 py-1.5 font-semibold">{formatMinutes(minutes)} studied</span>
          {dueCount > 0 && (
            <span title={`${dueCount} unfinished ${dueCount === 1 ? "deadline" : "deadlines"} due`} className="rounded-2xl bg-pink px-3 py-1.5 font-semibold text-on-pink">
              {dueCount} due
            </span>
          )}
        </>
      )}
    </p>
  );
}
