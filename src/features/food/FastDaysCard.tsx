import { Card } from "../../components/Card";
import { useSettings } from "../today/api";
import { useSaveFastDays } from "./api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Your fast days are a setting saved in the database, so changing them never needs new code
export function FastDaysCard() {
  const settings = useSettings();
  const save = useSaveFastDays();
  const fastDays = settings.data?.fast_days ?? [];

  function toggle(day: number) {
    const next = fastDays.includes(day) ? fastDays.filter((d) => d !== day) : [...fastDays, day].sort();
    save.mutate(next);
  }

  return (
    <Card title="My fast days" sticker="heart">
      <div role="group" aria-label="Fast days" className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((name, day) => {
          const on = fastDays.includes(day);
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              disabled={save.isPending || settings.isPending}
              onClick={() => toggle(day)}
              className={`rounded-xl py-1.5 text-sm font-semibold disabled:opacity-60 ${
                on ? "bg-pink text-on-pink" : "bg-card-soft text-ink-soft hover:text-ink"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
      {save.isError && (
        <p role="alert" className="text-sm">
          Could not save: {save.error.message}
        </p>
      )}
    </Card>
  );
}
