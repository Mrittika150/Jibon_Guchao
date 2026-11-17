import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

// No onSuccess in the mutations: the global rule in queryClient.ts refreshes everything after a save

export type Skill = { id: string; name: string; weekly_goal_minutes: number | null };
export type PracticeLog = { id: string; skill_id: string; log_date: string; minutes: number; note: string | null };
export type Course = { id: string; name: string };
export type Lesson = { id: string; course_id: string; title: string; done: boolean };
export type Deadline = { id: string; title: string; due_date: string; course_id: string | null; done: boolean };

// One small helper for "throw if Supabase says no", so every mutation stays short
async function check(request: PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await request;
  if (error) throw error;
}

// ---------- Skills and practice ----------

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase.from("skills").select("id, name, weekly_goal_minutes").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddSkill() {
  return useMutation({ mutationFn: (skill: Omit<Skill, "id">) => check(supabase.from("skills").insert(skill)) });
}

export function useDeleteSkill() {
  return useMutation({ mutationFn: (id: string) => check(supabase.from("skills").delete().eq("id", id)) });
}

export function usePracticeLogs(from: string, to: string) {
  return useQuery({
    queryKey: ["practice_logs", from, to],
    queryFn: async (): Promise<PracticeLog[]> => {
      const { data, error } = await supabase
        .from("practice_logs")
        .select("id, skill_id, log_date, minutes, note")
        .gte("log_date", from)
        .lte("log_date", to)
        .order("log_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddPractice() {
  return useMutation({
    mutationFn: (log: Omit<PracticeLog, "id">) => check(supabase.from("practice_logs").insert(log)),
  });
}

export function useDeletePractice() {
  return useMutation({ mutationFn: (id: string) => check(supabase.from("practice_logs").delete().eq("id", id)) });
}

// ---------- Courses and lessons ----------

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<{ courses: Course[]; lessons: Lesson[] }> => {
      const [courses, lessons] = await Promise.all([
        supabase.from("courses").select("id, name").order("created_at"),
        supabase.from("course_lessons").select("id, course_id, title, done").order("created_at"),
      ]);
      const error = courses.error ?? lessons.error;
      if (error) throw error;
      return { courses: courses.data ?? [], lessons: lessons.data ?? [] };
    },
  });
}

export function useAddCourse() {
  return useMutation({ mutationFn: (name: string) => check(supabase.from("courses").insert({ name })) });
}

export function useDeleteCourse() {
  return useMutation({ mutationFn: (id: string) => check(supabase.from("courses").delete().eq("id", id)) });
}

export function useAddLesson() {
  return useMutation({
    mutationFn: (lesson: { course_id: string; title: string }) => check(supabase.from("course_lessons").insert(lesson)),
  });
}

export function useToggleLesson() {
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      check(supabase.from("course_lessons").update({ done }).eq("id", id)),
  });
}

export function useDeleteLesson() {
  return useMutation({ mutationFn: (id: string) => check(supabase.from("course_lessons").delete().eq("id", id)) });
}

// ---------- Deadlines ----------

export function useDeadlines() {
  return useQuery({
    queryKey: ["deadlines"],
    queryFn: async (): Promise<Deadline[]> => {
      const { data, error } = await supabase
        .from("deadlines")
        .select("id, title, due_date, course_id, done")
        .order("due_date");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddDeadline() {
  return useMutation({
    mutationFn: (deadline: Omit<Deadline, "id" | "done">) => check(supabase.from("deadlines").insert(deadline)),
  });
}

export function useToggleDeadline() {
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => check(supabase.from("deadlines").update({ done }).eq("id", id)),
  });
}

export function useDeleteDeadline() {
  return useMutation({ mutationFn: (id: string) => check(supabase.from("deadlines").delete().eq("id", id)) });
}

// ---------- For the Today page ----------

// Minutes studied on a date, and how many unfinished deadlines are due by then
export function useStudySummary(date: string) {
  return useQuery({
    queryKey: ["study_summary", date],
    queryFn: async () => {
      const [practice, due] = await Promise.all([
        supabase.from("practice_logs").select("minutes").eq("log_date", date),
        supabase.from("deadlines").select("id").eq("done", false).lte("due_date", date),
      ]);
      const error = practice.error ?? due.error;
      if (error) throw error;
      return {
        minutes: (practice.data ?? []).reduce((sum, row) => sum + row.minutes, 0),
        dueCount: (due.data ?? []).length,
      };
    },
  });
}
