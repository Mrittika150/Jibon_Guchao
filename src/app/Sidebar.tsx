import { SCREENS, type ScreenId } from "./screens";
import { ThemeToggle } from "../components/ThemeToggle";
import { supabase } from "../lib/supabase";
import { toggleWidget } from "../widget/widgetWindow";

type SidebarProps = {
  current: ScreenId;
  onSelect: (id: ScreenId) => void;
};

export function Sidebar({ current, onSelect }: SidebarProps) {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-line bg-card p-4">
      <h1 className="mb-4 px-3 text-xl font-bold">Jibon Guchao </h1>

      {SCREENS.map((screen) => {
        const isActive = screen.id === current;
        return (
          <button
            key={screen.id}
            type="button"
            onClick={() => onSelect(screen.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-left font-semibold transition-colors ${
              isActive
                ? "bg-pink text-on-pink"
                : "text-ink-soft hover:bg-card-soft hover:text-ink"
            }`}
          >
            <img src={screen.icon} alt="" className="icon h-6 w-6" />
            {screen.label}
          </button>
        );
      })}

     <div className="mt-auto flex flex-col gap-2">
              <button
          type="button"
          onClick={() => toggleWidget()}
          className="rounded-2xl px-3 py-2 font-semibold text-ink-soft transition-colors hover:bg-card-soft hover:text-ink"
        >
          Show / hide widget
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="rounded-2xl px-3 py-2 font-semibold text-ink-soft transition-colors hover:bg-card-soft hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}