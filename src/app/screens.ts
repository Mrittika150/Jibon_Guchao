export const SCREENS = [
  { id: "today", label: "Today", emoji: "☀️" },
  { id: "calendar", label: "Calendar", emoji: "📅" },
  { id: "health", label: "Health", emoji: "💪" },
  { id: "food", label: "Food", emoji: "🍲" },
  { id: "expenses", label: "Expenses", emoji: "💸" },
  { id: "todos", label: "To-dos", emoji: "✅" },
  { id: "skills", label: "Skills", emoji: "📚" },
] as const;

export type ScreenId = (typeof SCREENS)[number]["id"];