import { useTheme } from "../themes/useTheme";

export function ThemeToggle(){
    const {theme , toggleTheme} = useTheme();
    const isDark = theme ==="dark";

    return (
        <button
          type="button"
          onClick={toggleTheme}
          aria-label = {isDark ? "Switch to pink theme" : "Switch to dark theme"}
          className="w-full rounded-2xl bg-card-soft px-3 py-2 font-semibold text-ink transition-colors hover:bg-pink hover:text-on-pink"
    >
      {isDark ? "🌙 Midnight" : "🌸 Pink"}
    </button>
  );

}