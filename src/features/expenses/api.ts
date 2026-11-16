import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { CategoryId } from "./categories";

export type Expense = {
  id: string;
  spent_on: string;
  amount_paisa: number;
  category: CategoryId;
  note: string | null;
};

export type NewExpense = Omit<Expense, "id">;

// Every expense between two dates (both included), newest first
export function useExpenses(from: string, to: string) {
  return useQuery({
    queryKey: ["expenses", from, to],
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, spent_on, amount_paisa, category, note")
        .gte("spent_on", from)
        .lte("spent_on", to)
        .order("spent_on", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// No onSuccess needed: the global rule in queryClient.ts refreshes everything after a save
export function useAddExpense() {
  return useMutation({
    mutationFn: async (expense: NewExpense) => {
      const { error } = await supabase.from("expenses").insert(expense);
      if (error) throw error;
    },
  });
}

export function useDeleteExpense() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
  });
}