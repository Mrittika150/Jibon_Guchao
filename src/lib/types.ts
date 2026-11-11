export type DailyLog = {
  id: string;
  log_date: string;
  weight_kg: number | null;
  steps: number | null;
  water_ml: number | null;
  walk_minutes: number | null;
  is_fast_day: boolean;
  note: string | null;
};

export type Exercise = {
  id: string;
  name: string;
  is_active: boolean;
};

export type ExerciseLog = {
  id: string;
  log_date: string;
  exercise_id: string;
};

export type Todo = {
  id: string;
  title: string;
  due_date: string | null;
  done: boolean;
};

export type Settings = {
  step_goal: number;
  water_goal_ml: number;
  fast_days: number[];
  days_off: number[];
};