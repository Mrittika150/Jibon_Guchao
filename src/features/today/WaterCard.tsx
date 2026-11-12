import { Card } from "../../components/Card";
import { Celebration, useGoalCelebration } from "../../components/Celebration";
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
  const celebrating = useGoalCelebration(current, goal);

  return (
    <Card title="Water" sticker="drop">
      <Celebration show={celebrating} />
      <p className="text-2xl font-bold">
        {current} <span className="text-base font-semibold text-ink-soft">ml</span>
      </p>
      <ProgressBar value={current} goal={goal} label="Water" unit="ml" step={50} onChange={onSave} />
      <p className="text-sm text-ink-soft">Goal: {goal} ml</p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          disabled={saving || current === 0}
          onClick={() => onSave(Math.max(0, current - GLASS_ML))}
          aria-label="Remove 1 glass"
          className="rounded-2xl border border-transparent bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60"
        >
          -
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(current + GLASS_ML)}
          className="flex-1 rounded-2xl border border-transparent bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60"
        >
          + 1 glass
        </button>
      </div>
    </Card>
  );
}