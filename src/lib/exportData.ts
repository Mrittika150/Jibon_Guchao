import { isTauri } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toCsv } from "./csv";
import { todayISO } from "./dates";
import { supabase } from "./supabase";
import type { DailyLog } from "./types";

export type ExportFormat = "json" | "csv";

// Every table, and a column to sort by so paging is stable
const TABLES = [
  { name: "user_settings", orderBy: "user_id" },
  { name: "daily_logs", orderBy: "id" },
  { name: "exercises", orderBy: "id" },
  { name: "exercise_logs", orderBy: "id" },
  { name: "todos", orderBy: "id" },
  { name: "expenses", orderBy: "id" },
  { name: "journal_entries", orderBy: "id" },
  { name: "meal_plan", orderBy: "id" },
  { name: "meal_logs", orderBy: "id" },
  { name: "foods", orderBy: "id" },
  { name: "skills", orderBy: "id" },
  { name: "practice_logs", orderBy: "id" },
  { name: "courses", orderBy: "id" },
  { name: "course_lessons", orderBy: "id" },
  { name: "deadlines", orderBy: "id" },
] as const;

const PAGE_SIZE = 1000;

// Supabase sends at most 1000 rows per request,
// so keep asking for the next page until a page comes back short.
async function fetchAll<T>(table: string, orderBy: string): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy)
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE_SIZE) return rows;
  }
}

// Everything, in one file you could restore from later
async function buildJsonBackup(): Promise<string> {
  const results = await Promise.all(
    TABLES.map(async (table) => [table.name, await fetchAll(table.name, table.orderBy)] as const),
  );
  const backup = {
    app: "jibon-guchao",
    format_version: 1,
    exported_at: new Date().toISOString(),
    tables: Object.fromEntries(results),
  };
  return JSON.stringify(backup, null, 2);
}

// Just the daily log, as a spreadsheet
async function buildDailyCsv(): Promise<string> {
  const logs = await fetchAll<DailyLog>("daily_logs", "log_date");
  const csv = toCsv(logs, ["log_date", "steps", "water_ml", "walk_minutes", "weight_kg", "is_fast_day", "note"]);
  return "\uFEFF" + csv; // a "BOM" so Excel knows the file is UTF-8
}

// Asks where to save, then writes the file. Returns the path, or null if you cancelled.
export async function exportData(format: ExportFormat): Promise<string | null> {
  if (!isTauri()) {
    throw new Error("Export only works in the desktop app, not in a web browser.");
  }

  const isJson = format === "json";
  const path = await save({
    title: isJson ? "Save full backup" : "Save daily log",
    defaultPath: isJson ? `jibon-guchao-backup-${todayISO()}.json` : `jibon-guchao-daily-log-${todayISO()}.csv`,
    filters: [isJson ? { name: "JSON backup", extensions: ["json"] } : { name: "CSV spreadsheet", extensions: ["csv"] }],
  });
  if (path === null) return null;

  const text = isJson ? await buildJsonBackup() : await buildDailyCsv();
  await writeTextFile(path, text);
  return path;
}