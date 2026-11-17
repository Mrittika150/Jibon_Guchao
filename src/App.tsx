import { useState } from "react";
import { Sidebar } from "./app/Sidebar";
import { SCREENS, type ScreenId } from "./app/screens";
import { useSession } from "./auth/useSession";
import { LoginScreen } from "./auth/LoginScreen";
import { TodayPage } from "./features/today/TodayPage";
import { todayISO } from "./lib/dates";
import { Sticker } from "./components/stickers/Sticker";
import { CalendarPage } from "./features/calendar/CalendarPage";
import { HealthPage } from "./features/health/HealthPage";
import { ExpensesPage } from "./features/expenses/ExpensesPage";
import { JournalPage } from "./features/journal/JournalPage";
import { FoodPage } from "./features/food/FoodPage";

type ScreenContentProps = {
  id: ScreenId;
  day: string;
  onOpenDay: (date: string) => void;
};

function ScreenContent({ id, day, onOpenDay }: ScreenContentProps) {
  switch (id) {
    case "today":
      return <TodayPage date={day} onChangeDate={onOpenDay} />;
    case "calendar":
      return <CalendarPage onOpenDay={onOpenDay} />;
    case "health":
      return <HealthPage />;
    case "food":
      return <FoodPage />;
    case "expenses":
      return <ExpensesPage />;
    case "journal":
      return <JournalPage />;
    default:
      return (
        <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
          <p className="text-ink-soft">This screen is coming soon</p>
        </div>
      );
  }
}

function App() {
  const [current, setCurrent] = useState<ScreenId>("today");
  // null means "whatever today is", so it stays right after midnight
  const [day, setDay] = useState<string | null>(null);
  const screen = SCREENS.find((s) => s.id === current) ?? SCREENS[0];
    const session = useSession();

  if (session === undefined) {
    return null;
  }
  if (session === null) {
    return <LoginScreen />;
  }

  function openDay(date: string) {
    setDay(date === todayISO() ? null : date);
    setCurrent("today");
  }

  function selectScreen(id: ScreenId) {
    if (id === "today") setDay(null); // the sidebar's Today always means today
    setCurrent(id);
  }

  return (
    <div className="flex h-screen">
      <Sidebar current={current} onSelect={selectScreen} />

      <main className="flex-1 overflow-y-auto p-6">
       <h2 className="flex items-center gap-3 text-2xl font-bold">
        <img src={screen.icon} alt="" className="icon h-8 w-8" />
        {screen.label}
        <Sticker name={screen.sticker} className="sticker-float h-11 w-11" />
      </h2>
                <div className="mt-4">
         <ScreenContent id={current} day={day ?? todayISO()} onOpenDay={openDay} />
        </div>
      </main>
    </div>
  );
}

export default App;