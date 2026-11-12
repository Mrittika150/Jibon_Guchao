import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { Celebration, useGoalCelebration } from "../../components/Celebration";
import { ProgressBar } from "../../components/ProgressBar";
import type { StickerName } from "../../components/stickers/Sticker";

type NumberCardProps = {
  title: string;
  icon?: string;
  sticker?: StickerName;
  unit: string;
  saved: number | null;
  goal?: number;
  step?: number;
  saving: boolean;
  onSave: (value: number | null) => void;
};

export function NumberCard({ title, icon, sticker, unit, saved, goal, step = 1, saving, onSave }: NumberCardProps) {
  const celebrating = useGoalCelebration(saved ?? 0, goal);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("value")?.toString().trim() ?? "";
    onSave(text === "" ? null : Number(text));
  }

  return (
    <Card title={title} icon={icon} sticker={sticker}>
      <Celebration show={celebrating} />
      <p className="text-2xl font-bold">
        {saved ?? "-"} <span className="text-base font-semibold text-ink-soft">{unit}</span>
      </p>

      {goal !== undefined && (
        <>
          <ProgressBar
            value={saved ?? 0}
            goal={goal}
            label={title}
            unit={unit}
            step={Math.max(step, Math.round(goal / 100))}
            onChange={onSave}
          />
          <p className="text-sm text-ink-soft">
            Goal: {goal.toLocaleString()} {unit}
          </p>
        </>
      )}

      <form key={saved ?? "empty"} onSubmit={handleSubmit} className="mt-auto flex gap-2">
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