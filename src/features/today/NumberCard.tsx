import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";

type NumberCardProps = {
  title: string;
  icon?: string;
  unit: string;
  saved: number | null;
  goal?: number;
  step?: number;
  saving: boolean;
  onSave: (value: number | null) => void;
};

export function NumberCard({ title, icon, unit, saved, goal, step = 1, saving, onSave }: NumberCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("value")?.toString().trim() ?? "";
    onSave(text === "" ? null : Number(text));
  }

  return (
    <Card title={title} icon={icon}>
      <p className="text-2xl font-bold">
        {saved ?? "-"} <span className="text-base font-semibold text-ink-soft">{unit}</span>
      </p>

      {goal !== undefined && (
        <>
          <ProgressBar value={saved ?? 0} goal={goal} label={`${title} progress`} />
          <p className="text-sm text-ink-soft">
            Goal: {goal.toLocaleString()} {unit}
          </p>
        </>
      )}

      <form key={saved ?? "empty"} onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="value"
          type="number"
          min={0}
          step={step}
          defaultValue={saved ?? ""}
          aria-label={`${title} in ${unit}`}
          className="w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60"
        >
          {saving ? "Saving" : "Save"}
        </button>
      </form>
    </Card>
  );
}