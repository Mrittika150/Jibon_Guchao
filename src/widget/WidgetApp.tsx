import { useSession } from "../auth/useSession";
import { Widget } from "./Widget";

// The widget's own front door: it only shows data once you are logged in
export function WidgetApp() {
  const session = useSession();

  if (session === undefined) return null;
  if (session === null) {
    return (
      <div data-tauri-drag-region className="flex h-screen items-center justify-center p-6 text-center">
        <p className="text-ink-soft">Log in in the main window to see your day here.</p>
      </div>
    );
  }
  return <Widget />;
}