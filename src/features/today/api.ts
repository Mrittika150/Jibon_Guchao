import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { DailyLog, Exercise, ExerciseLog, Settings, Todo } from "../../lib/types";

// ---------- Settings ----------

const DEFAULT_SETTINGS: Settings = {
  step_goal: 10000,
  water_goal_ml: 2000,
  fast_days: [],
  days_off: [],
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("step_goal, water_goal_ml, fast_days, days_off")
        .maybeSingle();
      if (error) throw error;
      return data ?? DEFAULT_SETTINGS;
    },
  });
}

// ---------- Daily log (steps, water, walk, weight, fast day) ----------

export function useDailyLog(date: string) {
  return useQuery({
    queryKey: ["daily_log", date],
    queryFn: async (): Promise<DailyLog | null> => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("log_date", date)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type DailyLogChanges = Partial<
  Pick<DailyLog, "weight_kg" | "steps" | "water_ml" | "walk_minutes" | "is_fast_day">
>;

export function useSaveDailyLog(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (changes: DailyLogChanges) => {
      const { error } = await supabase
        .from("daily_logs")
        .upsert({ log_date: date, ...changes }, { onConflict: "user_id,log_date" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["daily_log", date] }),
  });
}

// ---------- Exercises ----------

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async (): Promise<Exercise[]> => {
      const { data, error } = await supabase
        .from("exercises")
        .select("id, name, is_active")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("exercises").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useExerciseLogs(date: string) {
  return useQuery({
    queryKey: ["exercise_logs", date],
    queryFn: async (): Promise<ExerciseLog[]> => {
      const { data, error } = await supabase
        .from("exercise_logs")
        .select("id, log_date, exercise_id")
        .eq("log_date", date);
      if (error) throw error;
      return data;
    },
  });
}

export function useToggleExercise(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ exerciseId, done }: { exerciseId: string; done: boolean }) => {
      const { error } = done
        ? await supabase.from("exercise_logs").insert({ log_date: date, exercise_id: exerciseId })
        : await supabase
            .from("exercise_logs")
            .delete()
            .eq("log_date", date)
            .eq("exercise_id", exerciseId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercise_logs", date] }),
  });
}

// ---------- To-dos ----------

// Today's to-dos, plus older ones you have not finished yet
export function useTodos(date: string) {
  return useQuery({
    queryKey: ["todos", date],
    queryFn: async (): Promise<Todo[]> => {
      const { data, error } = await supabase
        .from("todos")
        .select("id, title, due_date, done")
        .or(`due_date.eq.${date},and(due_date.lt.${date},done.eq.false)`)
        .order("due_date")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddTodo(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase.from("todos").insert({ title, due_date: date });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase.from("todos").update({ done }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}