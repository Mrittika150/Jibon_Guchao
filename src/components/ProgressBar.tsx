type ProgressBarProps = {
  value: number;
  goal: number;
  label: string;
};

export function ProgressBar({ value, goal, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / goal) * 100));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={value}
      className="h-3 w-full overflow-hidden rounded-full bg-card-soft"
    >
      <div className="h-full rounded-full bg-pink transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}