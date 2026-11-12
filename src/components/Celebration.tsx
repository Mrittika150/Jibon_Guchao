import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Sticker } from "./stickers/Sticker";

// True for one second when `value` goes from below the goal to the goal or above.
// Pass null while the data is still loading, so loading never counts as "reaching" the goal.
export function useGoalCelebration(value: number | null, goal: number | undefined): boolean {
  const [celebrating, setCelebrating] = useState(false);
  const previous = useRef<number | null>(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = value;
    if (before === null || value === null || goal === undefined) return;
    if (before >= goal || value < goal) return;

    setCelebrating(true);
    const timer = setTimeout(() => setCelebrating(false), 1000);
    return () => clearTimeout(timer);
  }, [value, goal]);

  return celebrating;
}

const PIECES = 10;

// Hearts and sparkles that fly out from the middle of the card
export function Celebration({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <p role="status" className="sr-only">
        Goal reached!
      </p>
      {Array.from({ length: PIECES }, (_, i) => {
        const angle = (i / PIECES) * 2 * Math.PI;
        const distance = 55 + (i % 3) * 15;
        const style = {
          "--dx": `${Math.round(Math.cos(angle) * distance)}px`,
          "--dy": `${Math.round(Math.sin(angle) * distance)}px`,
          "--spin": `${i % 2 === 0 ? 40 : -40}deg`,
          animationDelay: `${(i % 3) * 40}ms`,
        } as CSSProperties;
        return (
          <Sticker
            key={i}
            name={i % 3 === 0 ? "sparkle" : "heart"}
            className="burst absolute top-1/2 left-1/2 h-5 w-5"
            style={style}
          />
        );
      })}
    </div>
  );
}
