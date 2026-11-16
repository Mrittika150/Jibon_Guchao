export const SCREENS = [
  { id: "today", label: "Today", icon: "/assets/task-list.png", sticker: "milk" },
  { id: "calendar", label: "Calendar", icon: "/assets/calendar.png", sticker: "star" },
  { id: "health", label: "Health", icon: "/assets/person.png", sticker: "heart" },
  { id: "food", label: "Food", icon: "/assets/healthy-food.png", sticker: "strawberry" },
  { id: "expenses", label: "Expenses", icon: "/assets/cash-flow.png", sticker: "flower" },
  { id: "journal", label: "Journal", icon: "/assets/journal.png", sticker: "bow" },
  { id: "todos", label: "To-dos", icon: "/assets/to-do-list.png", sticker: "bow" },
  { id: "skills", label: "Skills", icon: "/assets/cognitive-development.png", sticker: "bunny" },
] as const;

export type ScreenId = (typeof SCREENS)[number]["id"];