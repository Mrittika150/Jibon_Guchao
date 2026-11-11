import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";

type WaterCardProps = {
  saved: number | null;
  goal: number;
  saving: boolean;
  onSave: (value: number) => void;
};

const GLASS_ML = 250;

export function WaterCard({ saved, goal, saving, onSave }: WaterCardProps) {
  const current = saved ?? 0;

  return (
    <Card title="Water">
      <p className="text-3xl font-bold">
        {current} <span className="text-base font-semibold text-ink-soft">ml</span>
      </p>
      <ProgressBar value={current} goal={goal} label="Water progress" />
      <p className="text-sm text-ink-soft">Goal: {goal} ml</p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving || current === 0}
          onClick={() => onSave(Math.max(0, current - GLASS_ML))}
          className="rounded-2xl bg-card-soft px-4 py-2 font-bold disabled:opacity-60"
        >
          - 1 glass
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(current + GLASS_ML)}
          className="flex-1 rounded-2xl bg-pink px-4 py-2 font-bold text-on-pink disabled:opacity-60"
        >
          + 1 glass ({GLASS_ML} ml)
        </button>
      </div>
    </Card>
  );
}