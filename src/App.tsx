import { useState } from "react";
import { Sidebar } from "./app/Sidebar";
import { SCREENS, type ScreenId } from "./app/screens";

function App() {
  const [current, setCurrent] = useState<ScreenId>("today");
  const screen = SCREENS.find((s) => s.id === current) ?? SCREENS[0];

  return (
    <div className="flex h-screen">
      <Sidebar current={current} onSelect={setCurrent} />

      <main className="flex-1 overflow-y-auto p-8">
       <h2 className="flex items-center gap-3 text-3xl font-bold">
        <img src={screen.icon} alt="" className="icon h-10 w-10" />
        {screen.label}
      </h2>
        <div className="mt-6 rounded-3xl border border-line bg-card p-6 shadow-sm">
          <p className="text-ink-soft">This screen is coming soon </p>
        </div>
      </main>
    </div>
  );
}

export default App;