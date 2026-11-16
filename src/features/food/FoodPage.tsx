import { useState } from "react";
import { addDays, formatLongDate, todayISO, weekdayOf } from "../../lib/dates";
import { useDailyLog, useSaveDailyLog, useSettings } from "../today/api";
import { FastDaysCard } from "./FastDaysCard";
import { FoodListCard } from "./FoodListCard";
import { MealsCard } from "./MealsCard";

export function FoodPage() {
  const [date, setDate] = useState(todayISO);
  const isToday = date === todayISO();
  const log = useDailyLog(date);
  const settings = useSettings();
  const saveLog = useSaveDailyLog(date);

  // Fast-day mode follows the "Fast day" switch on Today; your schedule only suggests it
  const isFast = log.data?.is_fast_day ?? false;
  const isScheduled = (settings.data?.fast_days ?? []).includes(weekdayOf(date));

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
        {!isToday && (
          <button type="button" onClick={() => setDate(todayISO())} className="rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink">
            Back to today
          </button>
        )}

        {/* Fast-day mode switch, the same one as on the Today page */}
        <button
          type="button"
          aria-pressed={isFast}
          disabled={saveLog.isPending || log.isPending}
          onClick={() => saveLog.mutate({ is_fast_day: !isFast })}
          className={`ml-auto rounded-2xl px-3 py-1.5 font-bold disabled:opacity-60 ${
            isFast ? "bg-pink text-on-pink" : "bg-card text-ink-soft hover:bg-card-soft"
          }`}
        >
          {isFast ? "Fast day mode on" : "Fast day mode off"}
        </button>
      </div>

      {isScheduled && !isFast && (
        <p className="rounded-2xl bg-card-soft px-4 py-2 text-sm">
          This is one of your fast days. Turn on fast day mode to see your fast-day meals.
        </p>
      )}

      <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <MealsCard key={`${date}-${isFast}`} date={date} dayType={isFast ? "fast" : "normal"} isToday={isToday} />
        <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
          <FastDaysCard />
          <FoodListCard />
        </div>
      </div>
    </div>
  );
}
