import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

// No onSuccess in the mutations below: the global rule in queryClient.ts refreshes everything after a save

export type DayType = "normal" | "fast";

export type Meal = {
  id: string;
  day_type: DayType;
  meal_time: string; // "13:30:00"
  name: string;
  food: string;
};

export type FoodStatus = "love" | "avoid" | "ask";

export type Food = {
  id: string;
  name: string;
  status: FoodStatus;
};

// ---------- Meal plan ----------

export function useMealPlan(dayType: DayType) {
  return useQuery({
    queryKey: ["meal_plan", dayType],
    queryFn: async (): Promise<Meal[]> => {
      const { data, error } = await supabase
        .from("meal_plan")
        .select("id, day_type, meal_time, name, food")
        .eq("day_type", dayType)
        .order("meal_time");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddMeal() {
  return useMutation({
    mutationFn: async (meal: Omit<Meal, "id">) => {
      const { error } = await supabase.from("meal_plan").insert(meal);
      if (error) throw error;
    },
  });
}

export function useDeleteMeal() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("meal_plan").delete().eq("id", id);
      if (error) throw error;
    },
  });
}

// ---------- Ticking meals off ----------

export function useMealLogs(date: string) {
  return useQuery({
    queryKey: ["meal_logs", date],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.from("meal_logs").select("meal_id").eq("log_date", date);
      if (error) throw error;
      return data.map((row) => row.meal_id);
    },
  });
}

export function useToggleMeal(date: string) {
  return useMutation({
    mutationFn: async ({ mealId, eaten }: { mealId: string; eaten: boolean }) => {
      const { error } = eaten
        ? await supabase.from("meal_logs").insert({ log_date: date, meal_id: mealId })
        : await supabase.from("meal_logs").delete().eq("log_date", date).eq("meal_id", mealId);
      if (error) throw error;
    },
  });
}

// ---------- Food list ----------

export function useFoods() {
  return useQuery({
    queryKey: ["foods"],
    queryFn: async (): Promise<Food[]> => {
      const { data, error } = await supabase.from("foods").select("id, name, status").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddFood() {
  return useMutation({
    mutationFn: async (food: Omit<Food, "id">) => {
      const { error } = await supabase.from("foods").insert(food);
      if (error) throw error;
    },
  });
}

export function useDeleteFood() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("foods").delete().eq("id", id);
      if (error) throw error;
    },
  });
}

// ---------- Fast days (a setting, never fixed in the code) ----------

export function useSaveFastDays() {
  return useMutation({
    mutationFn: async (fastDays: number[]) => {
      const { error } = await supabase.from("user_settings").upsert({ fast_days: fastDays }, { onConflict: "user_id" });
      if (error) throw error;
    },
  });
}
