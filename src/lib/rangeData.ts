import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { DailyLog, ExerciseLog, Todo } from "./types";

export type RangeData = {
  logs: DailyLog[];
  exerciseLogs: ExerciseLog[];
  todos: Todo[];
};

// Everything saved between two dates (both included), in one go.
export function useRangeData(from: string, to: string) {
  return useQuery({
    queryKey: ["range", from, to],
    queryFn: async (): Promise<RangeData> => {
      const [logs, exerciseLogs, todos] = await Promise.all([
        supabase.from("daily_logs").select("*").gte("log_date", from).lte("log_date", to),
        supabase
          .from("exercise_logs")
          .select("id, log_date, exercise_id")
          .gte("log_date", from)
          .lte("log_date", to),
        supabase
          .from("todos")
          .select("id, title, due_date, done")
          .gte("due_date", from)
          .lte("due_date", to),
      ]);

      const error = logs.error ?? exerciseLogs.error ?? todos.error;
      if (error) throw error;

      return {
        logs: logs.data ?? [],
        exerciseLogs: exerciseLogs.data ?? [],
        todos: todos.data ?? [],
      };
    },
  });
}

// Groups a list by date, so you can ask "what happened on 2026-11-11?" quickly
export function groupByDate<T>(items: T[], getDate: (item: T) => string | null): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const date = getDate(item);
    if (date === null) continue;
    map.set(date, [...(map.get(date) ?? []), item]);
  }
  return map;
}