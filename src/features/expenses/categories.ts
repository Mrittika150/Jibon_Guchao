
export const CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "transport", label: "Transport" },
  { id: "health", label: "Health" },
  { id: "study", label: "Study" },
  { id: "shopping", label: "Shopping" },
  { id: "bills", label: "Bills" },
  { id: "gifts", label: "Gifts" },
  { id: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}