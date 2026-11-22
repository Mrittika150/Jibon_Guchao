import { useEffect, useState } from "react";
import { useMealLogs, useMealPlan } from "../features/food/api";
import { useDeadlines } from "../features/skills/api";
import { useDailyLog, useSettings } from "../features/today/api";
import { todayISO } from "../lib/dates";
import { notify } from "../lib/notify";
import { dueReminders } from "../lib/reminders";

const SENT_KEY = "jibon-guchao-reminders-sent";

// Which reminders were already shown today (kept in localStorage, so a restart doesn't repeat them)
function loadSent(today: string): Set<string> {
  try {
    const saved = JSON.parse(localStorage.getItem(SENT_KEY) ?? "null") as { date: string; ids: string[] } | null;
    if (saved?.date === today) return new Set(saved.ids);
  } catch {
    // broken or missing: start fresh
  }
  return new Set();
}

function saveSent(today: string, sent: Set<string>) {
  localStorage.setItem(SENT_KEY, JSON.stringify({ date: today, ids: [...sent] }));
}

// A component with no picture: it only runs logic. App shows it while you're logged in.
export function Reminders({ enabled }: { enabled: boolean }) {
  // Re-check once a minute (the clock moves even when nothing else changes)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  const today = todayISO();
  const settings = useSettings();
  const log = useDailyLog(today);
  const meals = useMealPlan(log.data?.is_fast_day ? "fast" : "normal");
  const eaten = useMealLogs(today);
  const deadlines = useDeadlines();

  useEffect(() => {
    if (!enabled) return;
    // Wait until everything has loaded, so we never remind based on half the data
    if (!settings.data || !log.isSuccess || !meals.data || !eaten.data || !deadlines.data) return;

    const now = new Date();
    const sent = loadSent(today);
    const due = dueReminders(
      {
        today,
        nowMinutes: now.getHours() * 60 + now.getMinutes(),
        meals: meals.data,
        eatenMealIds: eaten.data,
        waterMl: log.data?.water_ml ?? 0,
        waterGoalMl: settings.data.water_goal_ml,
        workStart: settings.data.work_start,
        workEnd: settings.data.work_end,
        deadlines: deadlines.data,
      },
      sent,
    );

    for (const reminder of due) {
      sent.add(reminder.id);
      void notify(reminder.title, reminder.body);
    }
    if (due.length > 0) saveSent(today, sent);
  }, [enabled, tick, today, settings.data, log.data, log.isSuccess, meals.data, eaten.data, deadlines.data]);

  return null;
}