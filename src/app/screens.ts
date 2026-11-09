export const SCREENS = [
  { id: "today", label: "Today", icon: "/assets/task-list.png" },
  { id: "calendar", label: "Calendar", icon: "/assets/calendar.png" },
  { id: "health", label: "Health", icon: "/assets/person.png" },
  { id: "food", label: "Food", icon: "/assets/healthy-food.png" },
  { id: "expenses", label: "Expenses", icon: "/assets/cash-flow.png" },
  { id: "todos", label: "To-dos", icon: "/assets/to-do-list.png" },
  { id: "skills", label: "Skills", icon: "/assets/cognitive-development.png" },
] as const;

export type ScreenId = (typeof SCREENS)[number]["id"];