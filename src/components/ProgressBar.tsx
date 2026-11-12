import { useState } from "react";
import { Sticker } from "./stickers/Sticker";

type ProgressBarProps = {
  value: number;
  goal: number;
  label: string;
  // Give these to make the bar draggable (a slider). Without them it only shows progress.
  onChange?: (value: number) => void;
  step?: number;
  unit?: string;
};

export function ProgressBar({ value, goal, label, onChange, step = 1, unit = "" }: ProgressBarProps) {
  // While you drag, show the new value straight away; save only when you let go
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;
  const max = Math.max(goal, value);
  const percent = Math.min(100, Math.round((shown / goal) * 100));

  function commit() {
    if (draft !== null && draft !== value) onChange?.(draft);
    setDraft(null);
  }

  return (
    <div className="relative rounded-full py-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-pink">
      <div
        role={onChange ? undefined : "progressbar"}
        aria-label={onChange ? undefined : label}
        aria-valuemin={onChange ? undefined : 0}
        aria-valuemax={onChange ? undefined : goal}
        aria-valuenow={onChange ? undefined : value}
        className={`w-full overflow-hidden rounded-full bg-card-soft ${onChange ? "h-3" : "h-2"}`}
      >
        <div
          className={`h-full rounded-full bg-pink ease-out ${draft === null ? "transition-all duration-700" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* A little heart rides along the end of the bar (it's the handle when draggable) */}
      <Sticker
        name="heart"
        className={`pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 ease-out ${
          onChange ? "h-6 w-6" : "h-4 w-4"
        } ${draft === null ? "transition-all duration-700" : ""}`}
        style={{ left: `clamp(10px, ${percent}%, calc(100% - 10px))` }}
      />

      {onChange && (
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={shown}
          aria-label={label}
          aria-valuetext={`${shown.toLocaleString()} ${unit}`.trim()}
          onChange={(event) => setDraft(Number(event.target.value))}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
          className="absolute inset-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing"
        />
      )}
    </div>
  );
}
