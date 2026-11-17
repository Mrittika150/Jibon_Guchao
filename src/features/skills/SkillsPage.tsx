import { useState } from "react";
import { CoursesTab } from "./CoursesTab";
import { DeadlinesTab } from "./DeadlinesTab";
import { PracticeTab } from "./PracticeTab";

const TABS = [
  { id: "practice", label: "Practice" },
  { id: "courses", label: "Courses" },
  { id: "deadlines", label: "Deadlines" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SkillsPage() {
  const [tab, setTab] = useState<TabId>("practice");

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Skills sections" className="flex gap-1 self-start rounded-2xl bg-card p-1">
        {TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            id={`tab-${option.id}`}
            aria-selected={tab === option.id}
            aria-controls={`panel-${option.id}`}
            onClick={() => setTab(option.id)}
            className={`rounded-xl px-4 py-1.5 font-semibold ${
              tab === option.id ? "bg-pink text-on-pink" : "text-ink-soft hover:bg-card-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "practice" && <PracticeTab />}
        {tab === "courses" && <CoursesTab />}
        {tab === "deadlines" && <DeadlinesTab />}
      </div>
    </div>
  );
}
