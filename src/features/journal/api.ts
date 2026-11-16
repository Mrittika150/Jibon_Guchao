import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { MoodId } from "./moods";

export type JournalEntry = {
  entry_date: string;
  mood: MoodId | null;
  body: string;
};

export type JournalChanges = Pick<JournalEntry, "mood" | "body">;

// One day's entry, or null if you haven't written that day
export function useJournalEntry(date: string) {
  return useQuery({
    queryKey: ["journal", date],
    queryFn: async (): Promise<JournalEntry | null> => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("entry_date, mood, body")
        .eq("entry_date", date)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

// All entries between two dates, newest first, for the month list
export function useJournalMonth(from: string, to: string) {
  return useQuery({
    queryKey: ["journal_month", from, to],
    queryFn: async (): Promise<JournalEntry[]> => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("entry_date, mood, body")
        .gte("entry_date", from)
        .lte("entry_date", to)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// A plain function (not a hook), so it can also run while the editor is closing
export async function saveJournalEntry(date: string, changes: JournalChanges) {
  const { error } = await supabase
    .from("journal_entries")
    .upsert(
      { entry_date: date, ...changes, updated_at: new Date().toISOString() },
      { onConflict: "user_id,entry_date" },
    );
  if (error) throw error;
}

export function useSaveJournal(date: string) {
  return useMutation({
    mutationFn: (changes: JournalChanges) => saveJournalEntry(date, changes),
  });
}
