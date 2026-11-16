// The same list as the database check in 202611161000_journal.sql
export const MOODS = [
  { id: "great", label: "Great" },
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "low", label: "Low" },
  { id: "rough", label: "Rough" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export function moodLabel(id: MoodId): string {
  return MOODS.find((mood) => mood.id === id)?.label ?? id;
}
